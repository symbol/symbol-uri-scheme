/*
   Copyright 2019 NEM

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

import {URIScheme} from "./URIScheme";
import {URIFormat} from "./URIFormat";
import {Transaction, TransactionMapping} from "nem2-sdk";

export class TransactionURI implements URIScheme {

    public static readonly PROTOCOL = "web+nem://";
    public static readonly ACTION = "transaction";

    /**
     * Create a TransactionURI.
     *
     * @param   format   {URIFormat}
     * @param   data   {object|string}
     * @param   chainId  {string}
     * @param   endpoint {string}
     */
    constructor(public readonly format: URIFormat,
                public readonly data: object | string,
                public readonly chainId?: string,
                public readonly endpoint?: string) {

        if ((format === URIFormat.serialized && typeof data !== "string") ||
            (format === URIFormat.DTO && typeof data !== "object")) {
            throw Error('The format and data passed do not match.');
        }
    }

    /**
     * Static constructor function from transaction
     * @param   format   {URIFormat}
     * @param   transaction   {Transaction}
     * @param   chainId  {string}
     * @param   endpoint {string}
     * @returns {TransactionURI}
     */
    static fromTransaction(format: URIFormat, transaction: Transaction, chainId?: string, endpoint?: string) {
        if (format === URIFormat.serialized) {
            return new TransactionURI(URIFormat.serialized, transaction.serialize(), chainId, endpoint);
        }
        return new TransactionURI(URIFormat.DTO, transaction.toJSON(), chainId, endpoint);
    }

    /**
     * Turn TransactionURI into Transaction object
     * @returns {Transaction}
     */
    toTransaction(): Transaction {
        if (this.format === URIFormat.serialized) {
            return TransactionMapping.createFromPayload(<string>this.data);
        }
        return TransactionMapping.createFromDTO(<object>this.data);
    }

    /**
     * Build the URI
     */
    build(): string {
        const base = TransactionURI.PROTOCOL
            + TransactionURI.ACTION
            + '?format=' + this.format
            + '&data=' + this.data.toString();
        const chainId = this.chainId ? '&chainId=' + this.chainId : '';
        const endpoint = this.endpoint ? '&endpoint=' + this.endpoint : '';
        return base + chainId + endpoint;
    }
}
