export interface QueryParams {
    action: string,
    format: string,
    list?: string
    rnnamespace?: string,
    rnlimit?: string,
    prop?: string,
    titles?: string,
    rvprop?: string,
    rvslots?: string,
    formatversion?: string,
    bot?: boolean,
    summary?: string,
    text?: string,
    minor?: boolean,
    token?: string
}

export interface ArticleDict {
    [articleName: string]: {
        text: string,
        regexEval: boolean,
        pipeRegexEval: boolean,
        templateRegexEval: boolean
    }
}