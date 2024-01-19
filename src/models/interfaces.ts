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
}

export interface ArticleDict {
    [articleName: string]: {
        regexEval: boolean;
        pipeRegexEval: boolean;
        templateRegexEval: boolean;
    }
}