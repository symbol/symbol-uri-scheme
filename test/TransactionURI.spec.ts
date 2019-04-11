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

import {expect, use} from "chai";
import chaiExclude from 'chai-exclude';

import {TransactionURI, URIFormat} from "../index";
import {
    Address,
    Deadline,
    Mosaic,
    MosaicId,
    NetworkCurrencyMosaic,
    NetworkType,
    PlainMessage,
    TransferTransaction,
    UInt64
} from "nem2-sdk";

use(chaiExclude);

describe('TransactionURI should', () => {

    it('be created with data and format', () => {
        const transactionURIDTO = new TransactionURI(URIFormat.DTO, {});
        const transactionURISerialized = new TransactionURI(URIFormat.serialized, '');
        expect(transactionURIDTO.format).to.deep.equal(URIFormat.DTO);
        expect(transactionURIDTO.data).to.deep.equal({});
        expect(transactionURISerialized.format).to.deep.equal(URIFormat.serialized);
        expect(transactionURISerialized.data).to.deep.equal('');
    });

    it('only allow valid data and format', () => {
        expect(function () {
            new TransactionURI(URIFormat.DTO, '')
        })
            .to.throw('The format and data passed do not match.');
        expect((function () {
            new TransactionURI(URIFormat.serialized, {})
        }))
            .to.throw('The format and data passed do not match.');
    });

    it('accept endpoint and chainId parameters', () => {
        const transactionURI = new TransactionURI(
            URIFormat.DTO, {},
            'local-network',
            'http://localhost:3000');
        expect(transactionURI.endpoint).to.deep.equal('http://localhost:3000');
        expect(transactionURI.chainId).to.deep.equal('local-network');
    });

    it('be created from transaction (serialized)', () => {
        const transaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SAGYCE-QM5SK2-TGFUC5-Z5GZJR-ATKTBS-UQQMMH-KW5B'),
            [NetworkCurrencyMosaic.createRelative(10)],
            PlainMessage.create('hello'),
            NetworkType.MIJIN_TEST
        );
        const transactionURI = TransactionURI.fromTransaction(URIFormat.serialized, transaction);
        expect(transactionURI.data).to.deep.equal(transaction.serialize());
    });

    it('be created from transaction (DTO)', () => {
        const transaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SAGYCE-QM5SK2-TGFUC5-Z5GZJR-ATKTBS-UQQMMH-KW5B'),
            [NetworkCurrencyMosaic.createRelative(10)],
            PlainMessage.create('hello'),
            NetworkType.MIJIN_TEST
        );
        const transactionURI = TransactionURI.fromTransaction(URIFormat.DTO, transaction);
        expect(transactionURI.data).to.deep.equal(transaction.toJSON());
    });

    it('build the URI from serialized data', () => {
        const serialized = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SAGYCE-QM5SK2-TGFUC5-Z5GZJR-ATKTBS-UQQMMH-KW5B'),
            [NetworkCurrencyMosaic.createRelative(10)],
            PlainMessage.create('hello'),
            NetworkType.MIJIN_TEST
        ).serialize();
        const transactionURI = new TransactionURI(URIFormat.serialized, serialized);
        expect(transactionURI.build()).to.deep.equal('web+nem://transaction?format=serialized' +
            '&data=' + serialized);
    });

    it('build the URI from DTO', () => {
        const transactionDTO = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SAGYCE-QM5SK2-TGFUC5-Z5GZJR-ATKTBS-UQQMMH-KW5B'),
            [NetworkCurrencyMosaic.createRelative(10)],
            PlainMessage.create('hello'),
            NetworkType.MIJIN_TEST
        ).toJSON();
        const transactionURI = new TransactionURI(URIFormat.DTO, transactionDTO, 'test',
            'http://localhost:3000');
        expect(transactionURI.build()).to.deep.equal('web+nem://transaction?format=DTO' +
            '&data=' + transactionDTO.toString()
            + '&chainId=test&endpoint=http://localhost:3000');
    });

    it('create a transaction (serialized) ', () => {
        const transaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SAGYCE-QM5SK2-TGFUC5-Z5GZJR-ATKTBS-UQQMMH-KW5B'),
            [new Mosaic(new MosaicId('7cdf3b117a3c40cc'), UInt64.fromUint(1000000))],
            PlainMessage.create('hello'),
            NetworkType.MIJIN_TEST
        )
        const transactionURI = new TransactionURI(URIFormat.serialized, transaction.serialize());
        expect(transactionURI.toTransaction()).to.deep.equal(transaction);
    });

    it('create a transaction (DTO) ', () => {
        const transaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SAGYCE-QM5SK2-TGFUC5-Z5GZJR-ATKTBS-UQQMMH-KW5B'),
            [new Mosaic(new MosaicId('acdf3b117a3c40cc'), UInt64.fromUint(10))],
            PlainMessage.create('hello'),
            NetworkType.MIJIN_TEST
        );
        const transactionURI = new TransactionURI(URIFormat.DTO, transaction.toJSON());
        expect(transactionURI.toTransaction()).excluding('signature').to.deep.equal(transaction);
    });
});
