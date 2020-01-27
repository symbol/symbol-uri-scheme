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

import {expect, use} from 'chai';
import chaiExclude from 'chai-exclude';
import {
    Address,
    Deadline,
    Mosaic,
    MosaicId,
    NetworkCurrencyMosaic,
    NetworkType,
    PlainMessage,
    TransferTransaction,
    UInt64,
} from 'nem2-sdk';
import {TransactionURI} from '../index';

use(chaiExclude);

describe('TransactionURI should', () => {

    it('be created with data and format', () => {
        const transactionURIDTO = new TransactionURI({foo: 'bar'});
        const transactionURISerialized = new TransactionURI('foo');
        expect(transactionURIDTO.data).to.deep.equal({foo: 'bar'});
        expect(transactionURISerialized.data).to.deep.equal('foo');
    });

    it('accept endpoint, generationHash and webhook parameters', () => {
        const transactionURI = new TransactionURI({},
            'local-network',
            'http://localhost:3000',
            'http://someexternalserver.com/webhook');
        expect(transactionURI.endpoint).to.deep.equal('http://localhost:3000');
        expect(transactionURI.generationHash).to.deep.equal('local-network');
        expect(transactionURI.webhook).to.deep.equal('http://someexternalserver.com/webhook');
    });

    it('be created from URI (payload)', () => {
        const serializedTransaction = 'B500000000000000406D262D78CE449BC743A2F27FFE05A677A922C6FBA0B6FD' +
            'F7EE115E01F76A60D2B027C4F8F2826F727ADEC0E6406C2ECC7C67C49FED2DAD' +
            '973F539046EE8A02CC499067D981CB2EA28D43537D8B3D91E1E0A1F7DA12DB13' +
            '5C1B9867DB80553B000000000198544140420F000000000015D6FE9001000000' +
            '99659BB8A2019FE9C60000000000000000000000000000000001050000000000' +
            '90D69CD255E556C640420F00000000000074657374';
        const URI = 'web+nem://transaction?data=' + serializedTransaction + '&generationHash=test' +
            '&endpoint=http://localhost:3000';
        const transactionURI = TransactionURI.fromURI(URI);
        transactionURI.toTransaction();
        expect(transactionURI.build()).to.deep.equal(URI);
    });

    it('be created from URI with a webhook', () => {
        const serializedTransaction = 'B500000000000000406D262D78CE449BC743A2F27FFE05A677A922C6FBA0B6FD' +
            'F7EE115E01F76A60D2B027C4F8F2826F727ADEC0E6406C2ECC7C67C49FED2DAD' +
            '973F539046EE8A02CC499067D981CB2EA28D43537D8B3D91E1E0A1F7DA12DB13' +
            '5C1B9867DB80553B000000000198544140420F000000000015D6FE9001000000' +
            '99659BB8A2019FE9C60000000000000000000000000000000001050000000000' +
            '90D69CD255E556C640420F00000000000074657374';
        const URI = 'web+nem://transaction?data=' + serializedTransaction +
            '&webhook=http://someexternalserver.com/webhook';
        const transactionURI = TransactionURI.fromURI(URI);
        transactionURI.toTransaction();
        expect(transactionURI.build()).to.deep.equal(URI);
    });

    it('be created from URI (DTO)', () => {
        const DTOTransaction = {
            transaction: {
                    type: 16724,
                    networkType: 144,
                    version: 36867,
                    maxFee: '0',
                    deadline: '1',
                    signature: '',
                    recipientAddress: {address: 'SAGYCEQM5SK2TGFUC5Z5GZJRATKTBSUQQMMHKW5B', networkType: 144},
                    mosaics: [{amount: '10000000', id: '7cdf3b117a3c40cc'}],
                    message: {type: 0, payload: 'hello'}}};
        const URI = 'web+nem://transaction?data=' + JSON.stringify(DTOTransaction);
        const transactionURI = TransactionURI.fromURI(URI);
        transactionURI.toTransaction();
        expect(transactionURI.build()).to.deep.equal(URI);
    });

    it('not be created from URI when data param is missing', () => {
        expect(() => {
            TransactionURI.fromURI('web+nem://transaction?chain_id=test');
        }).to.throw('Invalid URI: data parameter missing');
    });

    it('build the URI from serialized data', () => {
        const serialized = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SAGYCE-QM5SK2-TGFUC5-Z5GZJR-ATKTBS-UQQMMH-KW5B'),
            [NetworkCurrencyMosaic.createRelative(10)],
            PlainMessage.create('hello'),
            NetworkType.MIJIN_TEST).serialize();
        const transactionURI = new TransactionURI(serialized);
        expect(transactionURI.build()).to.deep.equal('web+nem://transaction?data=' + serialized);
    });

    it('build the URI from DTO', () => {
        const transactionDTO = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SAGYCE-QM5SK2-TGFUC5-Z5GZJR-ATKTBS-UQQMMH-KW5B'),
            [NetworkCurrencyMosaic.createRelative(10)],
            PlainMessage.create('hello'),
            NetworkType.MIJIN_TEST).toJSON();
        const transactionURI = new TransactionURI(transactionDTO, 'test',
            'http://localhost:3000');
        expect(transactionURI.build()).to.deep.equal('web+nem://transaction?data='
            + JSON.stringify(transactionDTO) + '&generationHash=test&endpoint=http://localhost:3000');
    });

    it('create a transaction (serialized) ', () => {
        const transaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SAGYCE-QM5SK2-TGFUC5-Z5GZJR-ATKTBS-UQQMMH-KW5B'),
            [new Mosaic(new MosaicId('7cdf3b117a3c40cc'), UInt64.fromUint(10000000))],
            PlainMessage.create('hello'),
            NetworkType.MIJIN_TEST);
        const transactionURI = new TransactionURI(transaction.serialize());
        expect(transactionURI.toTransaction()).to.deep.equal(transaction);
    });

    it('create a transaction (DTO) ', () => {
        const transaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SAGYCE-QM5SK2-TGFUC5-Z5GZJR-ATKTBS-UQQMMH-KW5B'),
            [new Mosaic(new MosaicId('acdf3b117a3c40cc'), UInt64.fromUint(10000000))],
            PlainMessage.create('hello'),
            NetworkType.MIJIN_TEST);
        const transactionURI = new TransactionURI(transaction.toJSON());
        expect(transactionURI.toTransaction()).excluding('signature').to.deep.equal(transaction);
    });
});
