# nem2-uri-scheme

[![npm version](https://badge.fury.io/js/nem2-uri-scheme.svg)](https://badge.fury.io/js/nem2-uri-scheme)
[![Build Status](https://travis-ci.org/nemfoundation/nem2-uri-scheme.svg?branch=master)](https://travis-ci.org/nemfoundation/nem2-uri-scheme)
[![Coverage Status](https://coveralls.io/repos/github/nemfoundation/nem2-uri-scheme/badge.svg?branch=master)](https://coveralls.io/github/nemfoundation/nem2-uri-scheme?branch=master)
[![Slack](https://img.shields.io/badge/chat-on%20slack-green.svg)](https://nem2.slack.com/messages/CB0UU89GS//)

Catapult URI Scheme generator to serve transactions ready to be signed.

This is a PoC to validate the proposed [NIP2 Transaction URI Scheme](https://github.com/nemtech/NIP/issues/6).

:warning: This library is experimental, use at your own risk.


## Important Notes

- [0.4.1](https://www.npmjs.com/package/nem2-uri-scheme) - **Fushicho3 Network Compatibility (catapult-server@0.9.1.1)**

## Installation

``npm install nem2-uri-scheme``

## Usage

### Transaction to URI

```ts
// examples/TransactionToURI.ts

import {Account, Deadline, EmptyMessage, NetworkCurrencyMosaic, NetworkType, TransferTransaction} from 'nem2-sdk';
import {TransactionURI} from 'nem2-uri-scheme';

const serializedTransaction = TransferTransaction.create(
    Deadline.create(),
    Account.generateNewAccount(NetworkType.TEST_NET).address,
    [NetworkCurrencyMosaic.createRelative(10)],
    EmptyMessage,
    NetworkType.TEST_NET
).serialize();
const generationHash = ''; // replace with network generation hash
const nodeUrl = 'http://localhost:3000';
const webhookUrl = 'http://myapp.local/id';
const transactionURI = new TransactionURI(serializedTransaction, generationHash, nodeUrl, webhookUrl);
console.log(transactionURI.build());

```

### URI to Transaction

```ts
// examples/URIToTransaction.ts

import {TransactionURI} from "nem2-uri-scheme";

const serializedTransaction = 'B500000000000000406D262D78CE449BC743A2F27FFE05A677A922C6FBA0B6FD' +
    'F7EE115E01F76A60D2B027C4F8F2826F727ADEC0E6406C2ECC7C67C49FED2DAD' +
    '973F539046EE8A02CC499067D981CB2EA28D43537D8B3D91E1E0A1F7DA12DB13' +
    '5C1B9867DB80553B000000000198544140420F000000000015D6FE9001000000' +
    '99659BB8A2019FE9C60000000000000000000000000000000001050000000000' +
    '90D69CD255E556C640420F00000000000074657374';

const URI = 'web+nem://transaction?data='+ serializedTransaction + '&generationHash=test' +
    '&endpoint=http://localhost:3000&webhook=http://myapp.local/id';
const transactionURI = TransactionURI.fromURI(URI);
const transaction = transactionURI.toTransaction();

```

## License

Licensed under the [Apache License](LICENSE.md), Version 2.
