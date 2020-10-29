/*
   Copyright 2019 - present NEM

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

import * as parse from 'url-parse';
import {IURIScheme} from './IURIScheme';
import {ITransactionMapper} from './ITransactionMapper';

export class TransactionURI<T> implements IURIScheme<T> {

    public static readonly PROTOCOL: string = 'web+symbol://';
    public static readonly ACTION: string = 'transaction';

    /**
     * Create a TransactionURI.
     *
     * @param   data - Transaction payload.
     * @param   generationHash  - Network generation hash.
     * @param   nodeUrl - Node url to submit the transaction.
     * @param   webhookUrl - URL to make a POST request after announcing the transaction.
     */
    constructor(public readonly data: string,
                public readonly transactionMapper: ITransactionMapper<T>,
                public readonly generationHash?: string,
                public readonly nodeUrl?: string,
                public readonly webhookUrl?: string) {
    }

    /**
     * Static constructor function from URI
     * @param   uri - Transaction URI scheme
     * @param   {ITransactionMapper} transactionMapper - creates a transaction object from given payload
     * @returns {TransactionURI}
     */
    static fromURI<T>(uri: string, transactionMapper: ITransactionMapper<T>) {
        const url = parse(uri, true);
        if (!url.query.data) {
            throw Error('Invalid URI: data parameter missing');
        }
        return new TransactionURI(
            url.query.data,
            transactionMapper,
            url.query.generationHash,
            url.query.nodeUrl,
            url.query.webhookUrl);
    }

    /**
     * Turn TransactionURI into Transaction object
     * @returns {Transaction}
     */
    toTransaction(): T {
        return this.transactionMapper(this.data);
    }

    /**
     * Build the URI
     */
    build(): string {
        const base = TransactionURI.PROTOCOL
            + TransactionURI.ACTION
            + '?data=' + this.data;
        const generationHash = this.generationHash ? '&generationHash=' + this.generationHash : '';
        const nodeUrl = this.nodeUrl ? '&nodeUrl=' + this.nodeUrl : '';
        const webhookUrl = this.webhookUrl ? '&webhookUrl=' + this.webhookUrl : '';
        return base + generationHash + nodeUrl + webhookUrl;
    }
}
