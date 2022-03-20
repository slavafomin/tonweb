import BN from 'bn.js';
import { ParseObjectParam, ParseObjectResult, ParseResponseParam, ParseResponseResult, ParseResponseStackParam, ParseResponseStackResult } from './types';
/**
 * @todo: extract all the static methods as individual functions
 *        there is no need to use class for this
 */
export declare class HttpProviderUtils {
    /**
     * @todo: improve typing
     */
    static parseObject(obj: ParseObjectParam): ParseObjectResult;
    /**
     * @todo: improve typing
     */
    static parseResponseStack(pair: ParseResponseStackParam): ParseResponseStackResult;
    static parseResponse(result: ParseResponseParam): ParseResponseResult;
    /**
     * @todo: function is unused: use or remove it
     */
    static makeArg(arg: any): ['num', (BN | Number)];
    /**
     * @todo: function is unused: use or remove it
     */
    static makeArgs(args: any[]): Array<['num', (BN | Number)]>;
}
