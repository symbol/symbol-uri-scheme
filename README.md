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
    Account.generateNewAccount(NetworkType.MIJIN_TEST).address,
    [NetworkCurrencyMosaic.createRelative(10)],
    EmptyMessage,
    NetworkType.MIJIN_TEST
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

const serializedTransaction = 'AA00000000000000000000000000000000000000000000000000000000000000000000000000000' +
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' +
    '000000000000000003905441000000000000000007AF3B3E16000000900D81120CEC95A998B41773D3653104D530CA908318755BA' +
    '10600010068656C6C6F44B262C46CEABB858096980000000000';
const URI = 'web+nem://transaction?data='+ serializedTransaction + '&generationHash=test' +
    '&endpoint=http://localhost:3000&webhook=http://myapp.local/id';
const transactionURI = TransactionURI.fromURI(URI);
const transaction = transactionURI.toTransaction();

```

## License

Licensed under the [Apache License](LICENSE.md), Version 2.
