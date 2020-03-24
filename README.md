# symbol-uri-scheme

[![npm version](https://badge.fury.io/js/symbol-uri-scheme.svg)](https://badge.fury.io/js/symbol-uri-scheme)
[![Build Status](https://travis-ci.org/nemfoundation/symbol-uri-scheme.svg?branch=master)](https://travis-ci.org/nemfoundation/symbol-uri-scheme)
[![Coverage Status](https://coveralls.io/repos/github/nemfoundation/symbol-uri-scheme/badge.svg?branch=master)](https://coveralls.io/github/nemfoundation/symbol-uri-scheme?branch=master)
[![Slack](https://img.shields.io/badge/chat-on%20slack-green.svg)](https://symbol.slack.com/messages/CB0UU89GS//)

Symbol URI Scheme generator to serve transactions ready to be signed.

This is a PoC to validate the proposed [NIP2 Transaction URI Scheme](https://github.com/nemtech/NIP/issues/6).

:warning: This library is experimental, use at your own risk.

## Requirements

- Node.js 12 LTS

## Installation

``npm install symbol-uri-scheme``

## Usage

### Transaction to URI

```ts
// examples/TransactionToURI.ts

import {Account, Deadline, EmptyMessage, NetworkCurrencyPublic, NetworkType, TransferTransaction} from 'symbol-sdk';
import {TransactionURI} from "../src/uris/TransactionURI";

const serializedTransaction = TransferTransaction.create(
    Deadline.create(),
    Account.generateNewAccount(NetworkType.TEST_NET).address,
    [NetworkCurrencyPublic.createRelative(10)],
    EmptyMessage,
    NetworkType.TEST_NET
).serialize();

const generationHash = 'ABC'; // replace with network generation hash
const nodeUrl = 'http://localhost:3000';
const webhookUrl = 'http://myapp.local/id';

const transactionURI = new TransactionURI(serializedTransaction, generationHash, nodeUrl, webhookUrl);
console.log(transactionURI.build());

```

### URI to Transaction

```ts
// examples/URIToTransaction.ts

import {TransactionURI} from "../src/uris/TransactionURI";

const serializedTransaction = 'B500000000000000406D262D78CE449BC743A2F27FFE05A677A922C6FBA0B6FD' +
    'F7EE115E01F76A60D2B027C4F8F2826F727ADEC0E6406C2ECC7C67C49FED2DAD' +
    '973F539046EE8A02CC499067D981CB2EA28D43537D8B3D91E1E0A1F7DA12DB13' +
    '5C1B9867DB80553B000000000198544140420F000000000015D6FE9001000000' +
    '99659BB8A2019FE9C60000000000000000000000000000000001050000000000' +
    '90D69CD255E556C640420F00000000000074657374';

const URI = 'web+symbol://transaction?data='+ serializedTransaction + '&generationHash=test' +
    '&nodeUrl=http://localhost:3000&webhookUrl=http://myapp.local/id';
const transactionURI = TransactionURI.fromURI(URI);

const transaction = transactionURI.toTransaction();
console.log(transaction);

```

## License

Licensed under the [Apache License](LICENSE.md), Version 2.
