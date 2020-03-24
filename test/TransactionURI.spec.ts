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

import {expect, use} from 'chai';
import chaiExclude from 'chai-exclude';
import {
    Address,
    Deadline,
    Mosaic,
    MosaicId,
    NetworkCurrencyPublic,
    NetworkType,
    PlainMessage,
    TransferTransaction,
    UInt64,
} from 'symbol-sdk';
import {TransactionURI} from '../index';

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
        const serializedTransaction = 'B500000000000000406D262D78CE449BC743A2F27FFE05A677A922C6FBA0B6FD' +
            'F7EE115E01F76A60D2B027C4F8F2826F727ADEC0E6406C2ECC7C67C49FED2DAD' +
            '973F539046EE8A02CC499067D981CB2EA28D43537D8B3D91E1E0A1F7DA12DB13' +
            '5C1B9867DB80553B000000000198544140420F000000000015D6FE9001000000' +
            '99659BB8A2019FE9C60000000000000000000000000000000001050000000000' +
            '90D69CD255E556C640420F00000000000074657374';
        const URI = 'web+symbol://transaction?data=' + serializedTransaction + '&generationHash=test' +
            '&nodeUrl=http://localhost:3000';
        const transactionURI = TransactionURI.fromURI(URI);
        transactionURI.toTransaction();
        expect(transactionURI.build()).to.deep.equal(URI);
    });

    it('be created from URI with a webhookUrl', () => {
        const serializedTransaction = 'B500000000000000406D262D78CE449BC743A2F27FFE05A677A922C6FBA0B6FD' +
            'F7EE115E01F76A60D2B027C4F8F2826F727ADEC0E6406C2ECC7C67C49FED2DAD' +
            '973F539046EE8A02CC499067D981CB2EA28D43537D8B3D91E1E0A1F7DA12DB13' +
            '5C1B9867DB80553B000000000198544140420F000000000015D6FE9001000000' +
            '99659BB8A2019FE9C60000000000000000000000000000000001050000000000' +
            '90D69CD255E556C640420F00000000000074657374';
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
            Address.createFromRawAddress('SAGYCE-QM5SK2-TGFUC5-Z5GZJR-ATKTBS-UQQMMH-KW5B'),
            [NetworkCurrencyPublic.createRelative(10)],
            PlainMessage.create('hello'),
            NetworkType.MIJIN_TEST).serialize();
        const transactionURI = new TransactionURI(serialized);
        expect(transactionURI.build()).to.deep.equal('web+symbol://transaction?data=' + serialized);
    });

    it('create a transaction', () => {
        const transaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SAGYCE-QM5SK2-TGFUC5-Z5GZJR-ATKTBS-UQQMMH-KW5B'),
            [new Mosaic(new MosaicId('7cdf3b117a3c40cc'), UInt64.fromUint(10000000))],
            PlainMessage.create('hello'),
            NetworkType.MIJIN_TEST);
        const transactionURI = new TransactionURI(transaction.serialize());
        expect(transactionURI.toTransaction()).to.deep.equal(transaction);
    });

});
