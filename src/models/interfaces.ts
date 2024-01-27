export interface QueryParams {
    action: string,
    format: string,
    title?: string,
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
    token?: string,
    rncontinue?: string,
    generator?: string,
    grnnamespace?: string,
    grnlimit?: string
    grncontinue?: string
}

export interface ArticleDict {
    [articleName: string]: {
        text: string,
        regexEval: boolean,
        pipeRegexEval: boolean,
        templateRegexEval: boolean
    }
}

export interface MwnOptions {
    OAuth2AccessToken?: string,
    OAuthCredentials?: {
        accessSecret: string;
        accessToken: string;
        consumerSecret: string;
        consumerToken: string
    },
    apiUrl?: string,
    defaultParams?: any,
    editConfig?: any,
    maxRetries?: number,
    password?: string,
    retryPause?: number,
    shutoff?: {
        condition?: RegExp | ((text: string) => boolean);
        intervalDuration?: number;
        onShutoff?: (text: string) => void;
        page?: string
    }
    silent?: boolean,
    suppressAPIWarnings?: boolean,
    userAgent?: string,
    username?: string
}