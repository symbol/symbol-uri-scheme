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

import {Transaction, TransactionMapping} from 'nem2-sdk';
import * as parse from 'url-parse';
import {URIScheme} from './URIScheme';

export class TransactionURI implements URIScheme {

    public static readonly PROTOCOL: string = 'web+nem://';
    public static readonly ACTION: string = 'transaction';

    /**
     * Create a TransactionURI.
     *
     * @param   data - Payload of the transaction.
     * @param   generationHash  - Network generation hash.
     * @param   endpoint - Node url to submit the transaction.
     * @param   webhook - URL to make a POST request after announcing the transaction.
     */
    constructor(public readonly data: object | string,
                public readonly generationHash?: string,
                public readonly endpoint?: string,
                public readonly webhook?: string) {
    }

    /**
     * Static constructor function from URI
     * @param   uri - Transaction URI scheme
     * @returns {TransactionURI}
     */
    static fromURI(uri: string) {
        const url = parse(uri, true);
        if (!url.query.data) {
            throw Error('Invalid URI: data parameter missing');
        }
        let data;
        try {
            data = JSON.parse(url.query.data || '');
        } catch (e) {
            data = url.query.data || '';
        }
        return new TransactionURI(
            data,
            url.query.generationHash,
            url.query.endpoint,
            url.query.webhook);
    }

    /**
     * Turn TransactionURI into Transaction object
     * @returns {Transaction}
     */
    toTransaction(): Transaction {
        if (typeof this.data === 'string') {
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
            + '?data=' + data;
        const generationHash = this.generationHash ? '&generationHash=' + this.generationHash : '';
        const endpoint = this.endpoint ? '&endpoint=' + this.endpoint : '';
        const webhook = this.webhook ? '&webhook=' + this.webhook : '';
        return base + generationHash + endpoint + webhook;
    }
}
