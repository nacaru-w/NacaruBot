import { regex, pipeRegex, templateRegex, titleRegex } from './regexes/regexes';
import { ArticleDict, QueryParams } from './models/interfaces';
import { categories } from './categories/categories';


const dateLinkRemoverControlPanel = (async () => {
    let sanitisedArray: (string | null)[] = [];
    let grncontinue: string | null;
    let exceptions: string[] | null = [];
    let articleDict: ArticleDict = {};
    let calls: number = 0;

    const cliProgress = require('cli-progress');
    const { Mwn } = require('mwn');

    const fs = require('node:fs/promises');
    const ora = require('ora');

    const bar1 = ora('Finding article...')
    bar1.spinner = 'arrow3'


    const credentials = await fs.readFile('./credentials.json').then((data: string) => {
        return JSON.parse(data);
    })

    const bot = await Mwn.init({
        apiUrl: 'https://es.wikipedia.org/w/api.php',

        // Can be skipped if the bot doesn't need to sign in
        username: credentials.username,
        password: credentials.password,

        // Set your user agent (required for WMF wikis, see https://meta.wikimedia.org/wiki/User-Agent_policy):
        userAgent: 'Nacarubot/1.0 JavaScript/:w:es:User:Nacaru/date-link-remover-control-panel.js',

        // Set default parameters to be sent to be included in every API request
        defaultParams: {
            assert: 'user' // ensure we're logged in
        }
    });

    console.log('Loading date-link-remover bot panel');

    function sanitiseArticle(article: string, content: string): string | null {
        if (titleRegex.test(article)) {
            return null;
        }
        if (exceptions!.some(e => article == e)) {
            return null;
        }
        if (categories.some(e => content.includes(e))) {
            return null;
        }

        const useRegex = regex.test(content);
        const usePipeRegex = pipeRegex.test(content);
        const useTemplateRegex = templateRegex.test(content);

        if (useRegex || usePipeRegex || useTemplateRegex) {
            articleDict[article] = {
                text: content,
                regexEval: useRegex,
                pipeRegexEval: usePipeRegex,
                templateRegexEval: useTemplateRegex,
            };
            return article;
        }

        return null;
    }

    async function genArticles(): Promise<void> {
        let params: QueryParams = {
            action: 'query',
            format: 'json',
            formatversion: "2",
            generator: 'random',
            grnnamespace: '0|104',
            grnlimit: '50',
            prop: 'revisions',
            rvprop: 'content',
            rvslots: 'main',
        };

        if (grncontinue) {
            params.grncontinue = grncontinue;
        }

        const result = await bot.request(params);
        calls++;
        grncontinue = result.continue?.grncontinue;
        const randoms = result.query.pages

        for (let item of randoms) {
            const sanitisedArticle: string | null = sanitiseArticle(
                item.title,
                item.revisions[0]?.slots?.main.content
            );
            if (sanitisedArticle) {
                sanitisedArray.push(sanitisedArticle);
                calls = 0;
            }
        }

        // Switch seeds if loading takes too long
        if (calls > 30) {
            grncontinue = null;
            calls = 0;
        }

    }

    async function getContent(pageName: string): Promise<string> {
        const params: QueryParams = {
            action: 'query',
            prop: 'revisions',
            titles: pageName,
            rvprop: 'content',
            rvslots: 'main',
            formatversion: '2',
            format: 'json'
        };

        let botPromise = bot.request(params).then(
            ((data: any) => {
                return data.query.pages[0].revisions[0].slots?.main?.content
            })
        );

        return botPromise;
    }

    async function getExceptions(): Promise<string[] | null> {
        const message = ora('Getting exceptions...').start();
        message.color = 'blue';
        try {
            const JSONList = await getContent('Usuario:NacaruBot/date-link-remover-control-panel/exceptions.json');
            message.succeed('Exceptions retrieved!');
            return JSON.parse(JSONList);

        } catch (error) {
            message.fail(`Error retrieving exceptions: ${error}`);
            return null
        }
    }

    function makeRegexGlobal(expression: RegExp): RegExp {
        return new RegExp(expression, "gi");
    }

    function replaceText(article: string): string {
        let newText: string = articleDict[article].text;
        if (articleDict[article].regexEval) {
            const newRegex = makeRegexGlobal(regex);
            newText = newText.replace(newRegex, "$1");
        }
        if (articleDict[article].pipeRegexEval) {
            const newPipeRegex = makeRegexGlobal(pipeRegex);
            newText = newText.replace(newPipeRegex, "$2");
        }
        if (articleDict[article].templateRegexEval) {
            const newTemplateRegex = makeRegexGlobal(templateRegex);
            newText = newText.replace(newTemplateRegex, "$1$2");
        }
        return newText;
    }

    async function editArticle(article: string): Promise<void> {
        const message = ora(`Editing: ${article}`).start();
        try {
            await bot.save(
                article,
                replaceText(article),
                'Bot: eliminando enlaces según [[WP:ENLACESFECHAS]]'
            );
            message.succeed(`Success: ${article}`);
        } catch (error) {
            message.fail(`Fail: ${article}.The following error happened: ${error}`);
        }
    }

    async function makeEdits(): Promise<void> {
        for (let article of sanitisedArray) {
            await editArticle(article!);
        }
    }

    async function submit(): Promise<void> {
        exceptions = await getExceptions();
        if (exceptions == null) {
            return console.log('Could not load exceptions, stopping execution');
        }
        while (true) {
            bar1.start();
            while (sanitisedArray.length < 1) {
                await genArticles();
            }
            bar1.stop();

            await makeEdits();
            sanitisedArray = [];
            calls = 0;
        }
    }

    (async () => {
        submit();
    })();

})();
