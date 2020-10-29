/**
 * Creates a transaction object from payload
 */
export interface ITransactionMapper<T> {
    (string) : T
}
