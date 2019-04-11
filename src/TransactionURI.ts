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
import {URLSearchParams} from "url";
import {Transaction, TransactionMapping} from "nem2-sdk";

export class TransactionURI implements URIScheme {

    public static readonly PROTOCOL = "web+nem://";
    public static readonly ACTION = "transaction";

    /**
     * Create a TransactionURI.
     *
     * @param   data   {object|string}
     * @param   chainId  {string}
     * @param   endpoint {string}
     */
    constructor(public readonly data: object | string,
                public readonly chainId?: string,
                public readonly endpoint?: string) {
    }

    /**
     * Static constructor function from URI
     * @param   uri   string
     * @returns {TransactionURI}
     */
    static fromURI(uri: string) {
        const params = new URLSearchParams(uri);
        if (!params.has('data')) {
            throw Error('Invalid URI: data parameter missing');
        }
        let data;
        try {
            data = JSON.parse(params.get('data') || '');
        }
        catch (e) {
            data = params.get('data') || '';
        }
        return new TransactionURI(
            data,
            params.get('chainId') || undefined,
            params.get('endpoint') || undefined
        );
    }


    /**
     * Turn TransactionURI into Transaction object
     * @returns {Transaction}
     */
    toTransaction(): Transaction {
        if (typeof this.data == 'string') {
            return TransactionMapping.createFromPayload(this.data);
        }
        return TransactionMapping.createFromDTO(this.data);
    }

    /**
     * Build the URI
     */
    build(): string {
        const data = typeof this.data === 'object' ? JSON.stringify(this.data) : this.data;
        const base = TransactionURI.PROTOCOL
            + TransactionURI.ACTION
            + '&data=' + data;
        const chainId = this.chainId ? '&chainId=' + this.chainId : '';
        const endpoint = this.endpoint ? '&endpoint=' + this.endpoint : '';
        return base + chainId + endpoint;
    }
}
