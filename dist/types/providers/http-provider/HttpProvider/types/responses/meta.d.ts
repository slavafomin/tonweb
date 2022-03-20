import { Blocks, Bytes, FullAccountState, Int32, Ok, Query, Raw, Smc, Tvm } from '../tl-spec';
import { AddressState, Cell, CellSerialized, Slice, WalletType } from './misc';
/**
 * Creates metadata for API method.
 */
interface MethodMeta<P, R> {
    params: P;
    response: R;
}
/**
 * Object with specified address.
 */
interface AddressParam {
    address: string;
}
export interface EstimateFeeParams {
    /**
     * Address in any format.
     */
    address: string;
    /**
     * base64-encoded cell with message body.
     */
    body: string;
    /**
     * base64-encoded cell with init-code.
     */
    init_code?: string;
    /**
     * base64-encoded cell with init-data.
     */
    init_data?: string;
    /**
     * If true during test query processing assume
     * that all chksig operations return True.
     *
     * default: `true`
     */
    ignore_chksig?: boolean;
}
export declare type EstimateFeeResult = Query.Fees;
declare type EstimateFeeMeta = MethodMeta<EstimateFeeParams, EstimateFeeResult>;
export interface GetAddressInformationResult extends Raw.FullAccountState {
    state: AddressState;
}
declare type GetAddressInformationMeta = MethodMeta<AddressParam, GetAddressInformationResult>;
export declare type GetAddressBalanceResult = Raw.FullAccountState['balance'];
declare type GetAddressBalanceMeta = MethodMeta<AddressParam, GetAddressBalanceResult>;
export declare type GetBlockHeaderResult = Blocks.Header;
declare type GetBlockHeaderMeta = MethodMeta<{
    workchain: number;
    shard: string;
    seqno: number;
}, GetBlockHeaderResult>;
export interface GetBlockTransactionsResult extends Blocks.Transactions {
    account?: string;
}
declare type GetBlockTransactionsMeta = MethodMeta<{
    workchain: number;
    shard: string;
    seqno: number;
    root_hash?: string;
    file_hash?: string;
    after_lt?: number;
    after_hash?: string;
    count?: number;
}, GetBlockTransactionsResult>;
export declare type GetExtendedAddressInformationResult = FullAccountState;
declare type GetExtendedAddressInformationMeta = MethodMeta<AddressParam, GetExtendedAddressInformationResult>;
export declare type GetMasterchainInfoResult = Blocks.MasterchainInfo;
declare type GetMasterchainInfoMeta = MethodMeta<never, GetMasterchainInfoResult>;
declare type GetTransactionsResultTransactionMessage = Omit<Raw.Transaction['in_msg'], 'source' | 'destination'> & {
    source: Raw.Transaction['in_msg']['source']['account_address'];
    destination: Raw.Transaction['in_msg']['destination']['account_address'];
    message?: string;
};
declare type GetTransactionsResultTransaction = Omit<Raw.Transaction, 'in_msg'> & {
    in_msg: GetTransactionsResultTransactionMessage;
    out_msgs: GetTransactionsResultTransactionMessage[];
};
export declare type GetTransactionsResult = GetTransactionsResultTransaction[];
declare type GetTransactionsMeta = MethodMeta<{
    address: string;
    limit?: number;
    lt?: number;
    hash?: string;
    to_lt?: number;
    archival?: boolean;
}, GetTransactionsResult>;
export declare type GetWalletInformationResult = {
    account_state: AddressState;
    balance: string;
    last_transaction_id?: Raw.FullAccountState['last_transaction_id'];
} & ({
    wallet: false;
} | {
    wallet: true;
    wallet_type: WalletType;
    wallet_id: Int32;
    seqno: Int32;
});
declare type GetWalletInformationMeta = MethodMeta<AddressParam, GetWalletInformationResult>;
/**
 * Currently, list of provided stack items is restricted by API.
 */
export declare type RunGetMethodParamsStackItem = ['num', number | string] | ['cell', Cell] | ['slice', Slice] | ['tvm.Cell', Bytes] | ['tvm.Slice', Bytes];
/**
 * Unlike RunGetMethodParamsStackItem, API returns strict types.
 */
export declare type RunGetMethodResultStackItem = ['num', string] | ['cell', Cell] | ['tuple', Tvm.StackEntryTuple['tuple']] | ['list', Tvm.StackEntryList['list']];
export interface RunGetMethodParams {
    address: string;
    method: (string | number);
    stack?: RunGetMethodParamsStackItem[];
}
export interface RunGetMethodResult extends Omit<Smc.RunResult, '@type' | 'stack'> {
    stack: RunGetMethodResultStackItem[];
}
declare type RunGetMethodMeta = MethodMeta<RunGetMethodParams, RunGetMethodResult>;
export declare type ShardsResult = Blocks.Shards;
declare type ShardsMeta = MethodMeta<{
    seqno: number;
}, ShardsResult>;
export declare type SendBocResult = Ok;
declare type SendBocMeta = MethodMeta<{
    boc: string;
}, SendBocResult>;
export interface SendQuerySimpleParams {
    address: string;
    body: string;
    init_code?: CellSerialized;
    init_data?: CellSerialized;
}
export declare type SendQuerySimpleResult = Ok;
declare type SendQuerySimpleMeta = MethodMeta<SendQuerySimpleParams, SendQuerySimpleResult>;
/**
 * Map, where key is a name of method in TON API and value is a description
 * of returned response type.
 *
 * @link https://toncenter.com/api/v2/
 */
export interface HttpProviderMethodMetaMap {
    estimateFee: EstimateFeeMeta;
    getAddressInformation: GetAddressInformationMeta;
    getAddressBalance: GetAddressBalanceMeta;
    getBlockHeader: GetBlockHeaderMeta;
    getBlockTransactions: GetBlockTransactionsMeta;
    getExtendedAddressInformation: GetExtendedAddressInformationMeta;
    getMasterchainInfo: GetMasterchainInfoMeta;
    getTransactions: GetTransactionsMeta;
    getWalletInformation: GetWalletInformationMeta;
    runGetMethod: RunGetMethodMeta;
    shards: ShardsMeta;
    sendBoc: SendBocMeta;
    sendQuerySimple: SendQuerySimpleMeta;
}
/**
 * API methods which don't require any arguments to call.
 */
export declare type HttpProviderMethodNoArgsName = {
    [M in keyof HttpProviderMethodMetaMap]: [
        HttpProviderMethodMetaMap[M]['params']
    ] extends [never] ? M : never;
}[keyof HttpProviderMethodMetaMap];
/**
 * Available HttpProvider web methods.
 */
export declare type HttpProviderMethodName = keyof HttpProviderMethodMetaMap;
/**
 * API methods which required arguments to call.
 */
export declare type HttpProviderMethodWithArgsName = Exclude<HttpProviderMethodName, HttpProviderMethodNoArgsName>;
/**
 * Returns type of parameters for specified API method.
 */
export declare type HttpProviderMethodParams<M extends HttpProviderMethodName> = HttpProviderMethodMetaMap[M]['params'];
/**
 * Returns type of response for specified API method.
 */
export declare type HttpProviderMethodResponse<M extends HttpProviderMethodName> = HttpProviderMethodMetaMap[M]['response'];
export {};
