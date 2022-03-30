import { Int64, WithType } from './shared';
export declare namespace Dns {
    type WithNSType<T extends string> = WithType<`dns.${T}`>;
    /**
     * @link https://github.com/newton-blockchain/ton/blob/ae5c0720143e231c32c3d2034cfe4e533a16d969/tl/generate/scheme/tonlib_api.tl#L75
     */
    export interface AccountState extends WithNSType<'accountState'> {
        wallet_id: Int64;
    }
    export {};
}
