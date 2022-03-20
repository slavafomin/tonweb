export declare type Int32 = number;
export declare type Int53 = number;
export declare type Int64 = string;
export declare type Bytes = string;
export declare type Bool = boolean;
export declare type Ok = {};
export declare type Hashtag = number;
export declare type Vector<T> = T[];
/**
 * Appends TL specification function or constructor name property.
 */
export interface WithType<T extends string> {
    '@type': T;
}
