//<nowiki>

/** 
 * Este script solo debe de ser utilizado por bots. Si posees un bot y estás interesado en implementarlo, por favor contacta con el autor (Nacaru).
 * 
 * Este código está liberado bajo la licencia GPL-3.0 (según se estipula en su repositorio original en https://github.com/nacaru-w/date-link-remover).
 */

import { QueryParams, ArticleDict } from './models/interfaces'

const dateLinkeRemoverControlPanel = (async () => {
    // Regexes variables
    const regex = /\[\[((?:\d{1,2}º?\sde\s)?(?:(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)(?:\sde\s[1-9]\d{0,3})?)|(?:lunes|martes|miércoles|jueves|viernes|sábado|domingo)|(?:(?:años?|década de)\s)?(?:[1-9]\d{0,3}|siglo(?:\s|&nbsp;)*\w+)(?:(?:\s|&nbsp;)*(?:a|d)\.(?:\s|&nbsp;)*C\.)?)\]\]/i;
    const pipeRegex = /\[\[((?:\d{1,2}º?\sde\s)?(?:(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)(?:\sde\s[1-9]\d{0,3})?)|(?:lunes|martes|miércoles|jueves|viernes|sábado|domingo)|(?:(?:años?|década de)\s)?(?:[1-9]\d{0,3}|siglo(?:\s|&nbsp;)*\w+)(?:(?:\s|&nbsp;)*(?:a|d)\.(?:\s|&nbsp;)*C\.)?)(?:\|([^\]]*))\]\]/i;
    const templateRegex = /(\{\{(?:siglo|(?:Julgreg)?fecha)[^\}]+)(?:\|1|\|Link\s*=\s*(?:\"true\"|(?:s[ií]|pt)))\s*(\}\})/i;

    // This one is so that the function that finds the articles can discard them if they're within the calendar-related scope
    const titleRegex = /^((?:\d{1,2}º? de |Anexo:[\dA-Za-zÀ-ÖØ-öø-ÿ\-\(\) ]+ en )?(?:(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|año|día|mes)?(?:(?: de )?[1-9]\d{0,3})?)|(?:(?:Anexo:)?(?:Cronología|Día|Mes|Década|Siglo) de[\dA-Za-zÀ-ÖØ-öø-ÿ\-\(\) ]+)|(?:(?:Anexo:)?(Años?|Día (?:mundial|(?:inter)?nacional)) [\dA-Za-zÀ-ÖØ-öø-ÿ\-\(\) ]+)|(?:(Calendario|Semana) [\dA-Za-zÀ-ÖØ-öø-ÿ\-\(\) ]+)|(?:lunes|martes|miércoles|jueves|viernes|sábado|domingo)|(?:(?:años?|década de)\s)?(?:[1-9]\d{0,3}(?: \(desambiguación\))?|siglo(?:\s|&nbsp;)*\w+)(?:(?:\s|&nbsp;)*(?:a|d)\.(?:\s|&nbsp;)*C\.)?)$/i;

    let articleList: string[];
    let articleDict: ArticleDict;
    let articlesFound: number;
    let exceptions: string[];

    const calendarCategories: string[] = ['[[Categoría:Anexos:Tablas anuales', "[[Categoría:Calendario"];

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

    console.log('Loading date-link-remover control panel');

    function getContent(pageName: string): Promise<string> {
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
        const JSONList = await getContent('Usuario:NacaruBot/date-link-remover-control-panel/exceptions.json');
        return JSON.parse(JSONList);
    }

    async function genArticleList(): Promise<string[]> {
        bar1.start(100, 0);
        let promises: Promise<string>[] = [];
        for (let i = 0; i < 100; i++) {
            promises.push(genArticle())
        }
        let result: string[] = await Promise.all(promises);
        bar1.stop();
        return result.flat(1);
    }

    async function genArticle(): Promise<string> {
        let selectedArticle: null | string = null;
        const params: QueryParams = {
            action: 'query',
            format: 'json',
            list: 'random',
            rnnamespace: '0|104',
            rnlimit: '1'
        };

        while (selectedArticle === null) {
            const result = await bot.request(params);
            const article = result.query.random[0].title;

            const calendarArticle = titleRegex.test(article);
            const isException = exceptions.some(e => article == e);

            if (calendarArticle || isException) {
                continue;
            }

            const content = await getContent(article);

            const hasCalendarCategory = calendarCategories.some(e => content.includes(e));

            if (!hasCalendarCategory) {
                const useRegex = regex.test(content);
                const usePipeRegex = pipeRegex.test(content);
                const useTemplateRegex = templateRegex.test(content);

                if (useRegex || usePipeRegex || useTemplateRegex) {
                    selectedArticle = article;
                    articleDict[selectedArticle!] = {
                        text: content,
                        regexEval: useRegex,
                        pipeRegexEval: usePipeRegex,
                        templateRegexEval: useTemplateRegex,
                    };
                }
            }
        }

        articlesFound++;
        bar1.update(articlesFound);

        return selectedArticle;

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

    async function submit(): Promise<void> {
        articlesFound = 0;
        articleDict = {};
        exceptions = await getExceptions();
        console.log('Loading articles...');
        articleList = await genArticleList();

        console.log('Found 100 articles, working on removing dates...')
        for (let article of articleList) {
            await editArticle(article);
        }
        submit();
    }

    (async () => {
        submit();
    })();

})();

//</nowiki>