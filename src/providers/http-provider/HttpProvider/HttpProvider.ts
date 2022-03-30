
import { HttpProviderUtils, ParseResponseResult } from '../HttpProviderUtils';
import {
    EstimateFeeParams, EstimateFeeResult,
    GetAddressBalanceResult,
    GetAddressInformationResult,
    GetBlockHeaderResult,
    GetBlockTransactionsResult,
    GetExtendedAddressInformationResult,
    GetMasterchainInfoResult,
    GetTransactionsResult,
    GetWalletInformationResult,
    HttpProviderMethodNoArgsName,
    HttpProviderMethodParams,
    HttpProviderMethodResponse,
    HttpProviderMethodWithArgsName,
    RunGetMethodParamsStackItem,
    RunGetMethodResult,
    SendBocResult,
    SendQuerySimpleParams, SendQuerySimpleResult,
    ShardsResult
} from './types';

export interface HttpProviderOptions {
    apiKey?: string;
}


// @todo: set `fetch` to "node-fetch" in Node.js via Webpack

const SHARD_ID_ALL = '-9223372036854775808'; // 0x8000000000000000

export const defaultHost = 'https://toncenter.com/api/v2/jsonRPC';


export class HttpProvider {

    public static SHARD_ID_ALL = SHARD_ID_ALL;


    constructor(
      public host = defaultHost,
      public options: HttpProviderOptions = {}
    ) {
    }

    /**
     * Calls known API method with parameters and returns typed response.
     * @param method
     * @param params
     */
    public send<M extends HttpProviderMethodWithArgsName>(
        method: M,
        params: HttpProviderMethodParams<M>
    ): Promise<HttpProviderMethodResponse<M>>
    /**
     * Calls known API method without parameters and returns typed response.
     * @param method
     */
    public send<M extends HttpProviderMethodNoArgsName>(
        method: M
    ): Promise<HttpProviderMethodResponse<M>>;
    public async send(method: string, params: any = {}): Promise<any> {
        // Expect JSON response.
        const headers = {
            'Content-Type': 'application/json',
        };

        // Append API key in case it was specified.
        if (this.options.apiKey) {
            headers['X-API-Key'] = this.options.apiKey;
        }

        // Send request.
        const response = await fetch(this.host, {
            method: 'POST',
            headers,
            body: JSON.stringify({ id: 1, jsonrpc: '2.0', method, params }),
        });
        const responseData = await response.json();

        // We expect plain object response. So, other responses are considered
        // inconsistent.
        if (
            typeof responseData !== 'object' ||
            Array.isArray(responseData) ||
            responseData === null
        ) {
            throw new Error('API returned inconsistent response.');
        }

        if ('error' in responseData) {
            // TODO:
            //  1. Throw custom error.
            //  2. Unless responseData is not typed, we are processing it in
            //   a safe way.
            throw new Error(
                typeof responseData.error === 'string'
                    ? responseData.error
                    : ('API returned error: ' + JSON.stringify(responseData.error))
            );
        }
        return responseData.result;
    }

    /**
     * Use this method to get information about address:
     * balance, code, data, last_transaction_id.
     *
     * {@link https://toncenter.com/api/v2/#/accounts/get_address_information_getAddressInformation_get}
     */
    public getAddressInfo(address: string): Promise<GetAddressInformationResult> {
        return this.send('getAddressInformation', { address });
    }

    /**
     * Similar to previous one but tries to parse additional
     * information for known contract types. This method is
     * based on `generic.getAccountState()` thus number of
     * recognizable contracts may grow. For wallets, we
     * recommend to use `getWalletInformation()`.
     *
     * {@link https://toncenter.com/api/v2/#/accounts/get_extended_address_information_getExtendedAddressInformation_get}
     */
    public getExtendedAddressInfo(
        address: string
    ): Promise<GetExtendedAddressInformationResult> {
        return this.send('getExtendedAddressInformation', { address });
    }

    /**
     * Use this method to retrieve wallet information.
     *
     * This method parses contract state and currently
     * supports more wallet types than
     * `getExtendedAddressInformation()`: simple wallet,
     * standard wallet and v3 wallet.
     *
     * {@link https://toncenter.com/api/v2/#/accounts/get_wallet_information_getWalletInformation_get}
     */
    public getWalletInfo(address: string): Promise<GetWalletInformationResult> {
        return this.send('getWalletInformation', { address });
    }

    /**
     * Use this method to get transaction history of a given address.
     *
     * Returns array of transaction objects.
     *
     * {@link https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get}
     */
    public getTransactions(
      address: string,
      limit = 20,
      lt?: number,
      hash?: string,
      to_lt?: number,
      archival?: boolean
    ): Promise<GetTransactionsResult> {
        return this.send('getTransactions', {
            address,
            limit,
            lt,
            hash,
            to_lt,
            archival,
        });
    };

    /**
     * Use this method to get balance (in nanograms)
     * of a given address.
     *
     * {@link https://toncenter.com/api/v2/#/accounts/get_address_balance_getAddressBalance_get}
     */
    public getBalance(address: string): Promise<GetAddressBalanceResult> {
        return this.send('getAddressBalance', { address });
    }

    /**
     * Use this method to send serialized boc file:
     * fully packed and serialized external message.
     *
     * {@link https://toncenter.com/api/v2/#/send/send_boc_sendBoc_post}
     */
    public sendBoc(
      /**
       * base64 string of boc bytes `Cell.toBoc`
       */
      base64: string
    ): Promise<SendBocResult> {
        return this.send('sendBoc', {boc: base64});
    };

    /**
     * Estimates fees required for query processing.
     *
     * {@link https://toncenter.com/api/v2/#/send/estimate_fee_estimateFee_post}
     */
    public getEstimateFee(query: EstimateFeeParams): Promise<EstimateFeeResult> {
        return this.send('estimateFee', query);
    };

    /**
     * Invokes get-method of smart contract.
     *
     * @todo: rename to `runGetMethodRaw()`
     *
     * {@link https://toncenter.com/api/v2/#/run%20method/run_get_method_runGetMethod_post}
     */
    public call(
      /**
       * Contract address.
       */
      address: string,
      /**
       * Method name or method ID.
       */
      method: (string | number),
      /**
       * Array of stack elements.
       */
      stack: RunGetMethodParamsStackItem[] = []
    ): Promise<RunGetMethodResult> {
        /**
         * @todo: think about throw error
         *        if result.exit_code !== 0
         *        (the change breaks backward compatibility)
         */
        return this.send('runGetMethod', {address, method, stack});
    }

    /**
     * Invokes get-method of smart contract.
     *
     * @todo: rename to `runGetMethod()`
     *
     * {@link https://toncenter.com/api/v2/#/run%20method/run_get_method_runGetMethod_post}
     */
    public async call2(
      /**
       * Contract address.
       */
      address: string,
      /**
       * Method name or method ID.
       */
      method: (string | number),
      /**
       * Array of stack elements.
       */
      params: RunGetMethodParamsStackItem[] = []
    ): Promise<ParseResponseResult> {
        const result = await this.send('runGetMethod', {
            address,
            method,
            stack: params,
        });

        return HttpProviderUtils.parseResponse(result);
    }

    /**
     * Returns ID's of last and init block of masterchain.
     *
     * {@link https://toncenter.com/api/v2/#/blocks/get_masterchain_info_getMasterchainInfo_get}
     */
    public getMasterchainInfo(): Promise<GetMasterchainInfoResult> {
        return this.send('getMasterchainInfo');
    }

    /**
     * Returns ID's of shardchain blocks included
     * in this masterchain block.
     *
     * {@link https://toncenter.com/api/v2/#/blocks/shards_shards_get}
     */
    public getBlockShards(masterchainBlockNumber: number): Promise<ShardsResult> {
        return this.send('shards', {seqno: masterchainBlockNumber});
    }

    /**
     * Returns transactions hashes included in this block.
     *
     * {@link https://toncenter.com/api/v2/#/blocks/get_block_transactions_getBlockTransactions_get}
     */
    public getBlockTransactions(
      workchain: number,
      shardId: string,
      shardBlockNumber: number
    ): Promise<GetBlockTransactionsResult> {
        return this.send('getBlockTransactions', {
            workchain,
            shard: shardId,
            seqno: shardBlockNumber,
        });
    }

    /**
     * Returns transactions hashes included
     * in this masterchain block.
     */
    public getMasterchainBlockTransactions(
        masterchainBlockNumber: number
    ): Promise<GetBlockTransactionsResult> {
        return this.getBlockTransactions(-1, SHARD_ID_ALL, masterchainBlockNumber);
    }

    /**
     * Returns block header and his previous blocks ID's.
     *
     * {@link https://toncenter.com/api/v2/#/blocks/get_block_header_getBlockHeader_get}
     */
    public getBlockHeader(
      workchain: number,
      shardId: string,
      shardBlockNumber: number
    ): Promise<GetBlockHeaderResult> {
        return this.send('getBlockHeader', {
            workchain,
            shard: shardId,
            seqno: shardBlockNumber,
        });
    }

    /**
     * Returns masterchain block header and his previous block ID.
     */
    public getMasterchainBlockHeader(
        masterchainBlockNumber: number
    ): Promise<GetBlockHeaderResult> {
        return this.getBlockHeader(-1, SHARD_ID_ALL, masterchainBlockNumber);
    }

    /**
     * Sends external message.
     *
     * {@link https://toncenter.com/api/v2/#/send/send_query_cell_sendQuerySimple_post}
     *
     * @deprecated
     */
    public sendQuery(query: SendQuerySimpleParams): Promise<SendQuerySimpleResult> {
        return this.send('sendQuerySimple', query);
    };

}
