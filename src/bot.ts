import { regex, pipeRegex, templateRegex, titleRegex } from './regexes/regexes';
import { ArticleDict, QueryParams } from './models/interfaces';
import { categories } from './categories/categories';


const dateLinkeRemoverControlPanel = (async () => {
    let sanitisedArray: (string | null)[] = [];
    let grncontinue: string;
    let exceptions: string[] = [];
    let articleDict: ArticleDict = {};
    let counter: number = 0;

    const cliProgress = require('cli-progress');
    const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    const { Mwn } = require('mwn');

    const fs = require('node:fs/promises');
    const ora = require('ora');


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
        if (exceptions.some(e => article == e)) {
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
            grnlimit: '500',
            prop: 'revisions',
            rvprop: 'content',
            rvslots: 'main',
        };

        if (grncontinue) {
            params.grncontinue = grncontinue;
        }

        const result = await bot.request(params);
        grncontinue = result.continue?.grncontinue;
        const randoms = result.query.pages

        for (let index in randoms) {
            const title = randoms[index].title;
            const content = randoms[index].revisions[0].slots?.main.content;
            const sanitisedArticle: string | null = sanitiseArticle(title, content);
            if (sanitisedArticle) {
                sanitisedArray.push(sanitisedArticle);
                counter++;
            }

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

    async function getExceptions(): Promise<string[]> {
        console.log("Loading exceptions...")
        const JSONList = await getContent('Usuario:NacaruBot/date-link-remover-control-panel/exceptions.json');
        return JSON.parse(JSONList);
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
        console.log('Editing articles...')
        for (let article of sanitisedArray) {
            await editArticle(article!);
        }
    }

    async function submit(): Promise<void> {
        exceptions = await getExceptions();
        console.log('Loading articles...');
        while (true) {
            bar1.start(100, 0);
            while (sanitisedArray.length < 100) {
                await genArticles();
            }
            bar1.stop();
            console.log("Number of articles found:", sanitisedArray.length)

            await makeEdits();
            console.log("Cleaning up and starting again...")
            sanitisedArray = [];
            counter = 0;
        }
    }

    (async () => {
        submit();
    })();

})();
