//<nowiki>

/** 
 * Este script solo debe de ser utilizado por bots. Si posees un bot y estás interesado en implementarlo, por favor contacta con el autor (Nacaru).
 * 
 * Este código está liberado bajo la licencia GPL-3.0 (según se estipula en su repositorio original en https://github.com/nacaru-w/date-link-remover).
 */

import { regex, pipeRegex, templateRegex, titleRegex } from './regexes/regexes';
import { ArticleDict, QueryParams } from './models/interfaces';
import { categories } from './categories/categories';


const dateLinkeRemoverControlPanel = (async () => {
    let articleArray: string[] = [];
    let sanitisedArray: (string | null)[] = [];
    let rncontinue: string = '';
    let exceptions: string[] = [];
    let articleDict: ArticleDict = {};

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

    async function genArticles(): Promise<void> {
        let params: QueryParams = {
            action: 'query',
            format: 'json',
            list: 'random',
            rnnamespace: '0|104',
            rnlimit: '500',
        };

        if (rncontinue) {
            params.rncontinue = rncontinue;
        }

        const result = await bot.request(params);
        const randoms = result.query.random
        for (let r in randoms) {
            articleArray.push(randoms[r].title)
        }

        rncontinue = result.continue?.rncontinue;
    }

    async function sanitiseArticle(article: string): Promise<string | null> {
        if (titleRegex.test(article)) {
            return null;
        }
        if (exceptions.some(e => article == e)) {
            return null;
        }

        const content = await getContent(article);

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

    async function sanitiseArray(): Promise<void> {
        let results;
        let promiseArray = [];

        for (let article of articleArray) {
            promiseArray.push(sanitiseArticle(article));
        }

        results = await Promise.all(promiseArray);
        let finalResult = results.flat(1);
        let filteredFinalResult = finalResult.filter((element) => element != null)
        for (let a of filteredFinalResult) {
            sanitisedArray.push(a);
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
                await sanitiseArray();
                bar1.update(sanitisedArray.length > 100 ? 100 : sanitisedArray.length);
                articleArray = [];
            }

            console.log("Number of articles found:", sanitisedArray.length)

            await makeEdits();
            console.log("Cleaning up and starting again...")
            sanitisedArray = [];
        }
    }

    (async () => {
        submit();
    })();

})();

//</nowiki>
