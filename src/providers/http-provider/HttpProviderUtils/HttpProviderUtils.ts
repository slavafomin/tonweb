
import BN from 'bn.js';

import { Cell } from '../../../boc/cell';
import { base64ToBytes } from '../../../utils/common';
import {RunGetMethodResult, RunGetMethodResultStackItem} from '../HttpProvider';
import {
    ParseObjectParam,
    ParseObjectResult, ParseResponseParam, ParseResponseResult,
    ParseResponseStackParam, ParseResponseStackResult
} from './types';

/**
 * @todo: extract all the static methods as individual functions
 *        there is no need to use class for this
 */
export class HttpProviderUtils {

    /**
     * @todo: improve typing
     */
    public static parseObject(obj: ParseObjectParam): ParseObjectResult {
        const typeName = obj['@type'];
        switch (typeName) {
            case 'tvm.list':
            case 'tvm.tuple':
                return obj.elements.map(HttpProviderUtils.parseObject);
            case 'tvm.stackEntryTuple':
                return HttpProviderUtils.parseObject(obj.tuple);
            case 'tvm.stackEntryNumber':
                return HttpProviderUtils.parseObject(obj.number);
            case 'tvm.numberDecimal':
                return new BN(obj.number, 10);
            default:
                throw new Error('unknown type ' + typeName);
        }
    }

    /**
     * @todo: improve typing
     */
    public static parseResponseStack(
        pair: ParseResponseStackParam
    ): ParseResponseStackResult {
        if (pair[0] === 'num') {
            return new BN(pair[1].replace(/0x/, ''), 16);
        }
        if (pair[0] === 'list' || pair[0] === 'tuple') {
            return HttpProviderUtils.parseObject(pair[1]);
        }
        if (pair[0] === 'cell') {
            const contentBytes = base64ToBytes(pair[1].bytes);
            return Cell.oneFromBoc(contentBytes);
        }
        throw new Error(
            `Failed to parse response stack, unknown type: ${pair[0]}`
        );
    }

    public static parseResponse(
        result: ParseResponseParam
    ): ParseResponseResult {
        if (result.exit_code !== 0) {
            // @todo: use custom error class
            const error = new Error('Failed to parse response');
            (error as any).result = result;
            throw error;
        }
        const arr = result.stack.map(HttpProviderUtils.parseResponseStack);
        return (arr.length === 1 ? arr[0] : arr);
    }

    /**
     * @todo: function is unused: use or remove it
     */
    public static makeArg(arg: any): ['num', (BN | Number)] {
        if (BN.isBN(arg) || typeof arg === 'number') {
            return ['num', arg];
        } else {
            throw new Error(`Unknown argument type: ${arg}`);
        }
    }

    /**
     * @todo: function is unused: use or remove it
     */
    public static makeArgs(args: any[]): Array<['num', (BN | Number)]> {
        return args.map(this.makeArg);
    }

}
