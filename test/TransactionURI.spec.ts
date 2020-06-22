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

import { expect, use } from 'chai';
import chaiExclude from 'chai-exclude';
import { Account, Deadline, Mosaic, MosaicId, NetworkCurrencyPublic, NetworkType, PlainMessage, TransferTransaction, UInt64 } from 'symbol-sdk';

import { TransactionURI } from '../index';

use(chaiExclude);

describe('TransactionURI should', () => {

    it('be created with data and format', () => {
        const transactionURISerialized = new TransactionURI('foo');
        expect(transactionURISerialized.data).to.deep.equal('foo');
    });

    it('accept nodeUrl, generationHash and webhookUrl parameters', () => {
        const transactionURI = new TransactionURI('test',
            'local-network',
            'http://localhost:3000',
            'http://someexternalserver.com/webhookUrl');
        expect(transactionURI.nodeUrl).to.deep.equal('http://localhost:3000');
        expect(transactionURI.generationHash).to.deep.equal('local-network');
        expect(transactionURI.webhookUrl).to.deep.equal('http://someexternalserver.com/webhookUrl');
    });

    it('be created from URI', () => {
        const serializedTransaction = 'B600000000000000000000000000000000000000000' +
        '0000000000000000000000000000000000000000000000000000000000000000000000000' +
        '0000000000000000000000000000000000000000000000000000000000000000000000000' +
        '0000000000000000000000000000190544100000000000000005816E98404000000900FFE' +
        'A45AEA2EE9B880D5E4F9B91B75857F444F1766CDCB0600010000000000CC403C7A113BDF7' +
        'C80969800000000000068656C6C6F';
        const URI = 'web+symbol://transaction?data=' + serializedTransaction + '&generationHash=test' +
            '&nodeUrl=http://localhost:3000';
        const transactionURI = TransactionURI.fromURI(URI);
        transactionURI.toTransaction();
        expect(transactionURI.build()).to.deep.equal(URI);
    });

    it('be created from URI with a webhookUrl', () => {
        const serializedTransaction = 'B600000000000000000000000000000000000000000' +
        '0000000000000000000000000000000000000000000000000000000000000000000000000' +
        '0000000000000000000000000000000000000000000000000000000000000000000000000' +
        '0000000000000000000000000000190544100000000000000005816E98404000000900FFE' +
        'A45AEA2EE9B880D5E4F9B91B75857F444F1766CDCB0600010000000000CC403C7A113BDF7' +
        'C80969800000000000068656C6C6F';
        const URI = 'web+symbol://transaction?data=' + serializedTransaction +
            '&webhookUrl=http://someexternalserver.com/webhookUrl';
        const transactionURI = TransactionURI.fromURI(URI);
        transactionURI.toTransaction();
        expect(transactionURI.build()).to.deep.equal(URI);
    });

    it('not be created from URI when data param is missing', () => {
        expect(() => {
            TransactionURI.fromURI('web+symbol://transaction?chain_id=test');
        }).to.throw('Invalid URI: data parameter missing');
    });

    it('build the URI from serialized data', () => {
        const serialized = TransferTransaction.create(
            Deadline.create(),
            Account.generateNewAccount(NetworkType.MIJIN_TEST).address,
            [NetworkCurrencyPublic.createRelative(10)],
            PlainMessage.create('hello'),
            NetworkType.MIJIN_TEST).serialize();
        const transactionURI = new TransactionURI(serialized);
        expect(transactionURI.build()).to.deep.equal('web+symbol://transaction?data=' + serialized);
    });

    it('create a transaction', () => {
        const transaction = TransferTransaction.create(
            Deadline.create(),
            Account.generateNewAccount(NetworkType.MIJIN_TEST).address,
            [new Mosaic(new MosaicId('7cdf3b117a3c40cc'), UInt64.fromUint(10000000))],
            PlainMessage.create('hello'),
            NetworkType.MIJIN_TEST);
            console.log(transaction.serialize());
        const transactionURI = new TransactionURI(transaction.serialize());
        expect(transactionURI.toTransaction()).to.deep.equal(transaction);
    });

});
