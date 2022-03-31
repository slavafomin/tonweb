
export type RequestHeaders = (
    Record<string, string | string[]>
);

export interface HttpRequest<BodyType = any> {
    url: string;
    method?: HttpRequestMethod;
    query?: Record<string, any>;
    body?: BodyType;
    headers?: RequestHeaders;
}

export interface HttpResponse<PayloadType = any> {
    status: number;
    payload: PayloadType;
}

export type HttpRequestMethod = (
    | 'GET'
    | 'POST'
)

export interface HttpClient {

    sendRequest<ResponsePayloadType>(request: HttpRequest): (
        Promise<HttpResponse<ResponsePayloadType>>
    );

}
