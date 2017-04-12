
interface SimpleddlOptions{
    multiple?:boolean,
    emptyResultText?:string,
    defaultOptionText?:string,
    defaultOptionValue?:string,
    search?:boolean,
    rightToLeft?:boolean
}





interface JQuery {
    Simpleddl(options?: SimpleddlOptions): JQuery;
    Simpleddl(functionName:string, parameter:any): JQuery;
}