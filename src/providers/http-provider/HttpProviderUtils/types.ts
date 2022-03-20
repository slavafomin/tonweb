import {Tvm} from '../HttpProvider/types/tl-spec';
import BN from 'bn.js';
import {RunGetMethodResult, RunGetMethodResultStackItem} from '../HttpProvider';
import {Cell} from '../../../boc/cell';

/* parseObject */
export type ParseObjectParam =
    | Tvm.List
    | Tvm.Tuple
    | Tvm.NumberDecimal
    | Tvm.StackEntry;

export type ParseObjectResult =
    | BN
    | ParseObjectResult[];

/* parseResponseStack */
export type ParseResponseStackParam = RunGetMethodResultStackItem;

export type ParseResponseStackResult = BN | ParseObjectResult | Cell;

/* parseResponse */
export type ParseResponseParam = RunGetMethodResult;

export type ParseResponseResult =
    | ParseResponseStackResult
    | ParseResponseStackResult[];
