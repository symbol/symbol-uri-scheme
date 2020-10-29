# Symbol URI Scheme

[![npm version](https://badge.fury.io/js/symbol-uri-scheme.svg)](https://badge.fury.io/js/symbol-uri-scheme)
[![Build Status](https://travis-ci.com/nemtech/symbol-uri-scheme.svg?branch=main)](https://travis-ci.com/nemfoundation/symbol-uri-scheme)
[![Coverage Status](https://coveralls.io/repos/github/nemtech/symbol-uri-scheme/badge.svg?branch=main)](https://coveralls.io/github/nemtech/symbol-uri-scheme?branch=main)
[![Slack](https://img.shields.io/badge/chat-on%20slack-green.svg)](https://symbol.slack.com/messages/CB0UU89GS//)

URI Scheme library to serve Symbol transactions ready to be signed.

This is a PoC to validate the proposed [NIP2 Transaction URI Scheme](https://github.com/nemtech/NIP/issues/6). When stable, the repository will be moved to the [nemtech](https://github.com/nemtech) organization.

## Requirements

- Node.js 12 LTS

## Installation

``npm install symbol-uri-scheme``

## Usage

### Generate URI from Transaction

```ts
// examples/TransactionToURI.ts

import { Account, Deadline, EmptyMessage, NetworkCurrencyPublic, NetworkType, TransferTransaction, TransactionMapping } from 'symbol-sdk';

import { TransactionURI } from '../src/uris/TransactionURI';

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

const transactionURI = new TransactionURI(serializedTransaction, TransactionMapping.createFromPayload, generationHash, nodeUrl, webhookUrl);
console.log(transactionURI.build());

```

### Create Transaction from URI

```ts
// examples/URIToTransaction.ts

import { TransactionMapping } from 'symbol-sdk';
import { TransactionURI } from '../src/uris/TransactionURI';

const serializedTransaction = 'B600000000000000000000000000000000000000000' +
'0000000000000000000000000000000000000000000000000000000000000000000000000' +
'0000000000000000000000000000000000000000000000000000000000000000000000000' +
'0000000000000000000000000000190544100000000000000005816E98404000000900FFE' +
'A45AEA2EE9B880D5E4F9B91B75857F444F1766CDCB0600010000000000CC403C7A113BDF7' +
'C80969800000000000068656C6C6F';

const URI = 'web+symbol://transaction?data=' + serializedTransaction + '&generationHash=test' +
    '&nodeUrl=http://localhost:3000&webhookUrl=http://myapp.local/id';
const transactionURI = TransactionURI.fromURI(URI, TransactionMapping.createFromPayload);

const transaction = transactionURI.toTransaction();
console.log(transaction);

```

## Getting help

Use the following available resources to get help:

- [Symbol Documentation][docs]
- Join the community [slack group (#sig-client)][slack] 
- If you found a bug, [open a new issue][issues]

## Contributing

Contributions are welcome and appreciated. 
Check [CONTRIBUTING](CONTRIBUTING.md) for information on how to contribute.

## License

Copyright 2019-present NEM

Licensed under the [Apache License 2.0](LICENSE)

[self]: https://github.com/nemtech/symbol-uri-scheme
[docs]: https://nemtech.github.io
[issues]: https://github.com/nemtech/symbol-uri-scheme/issues
[slack]: https://join.slack.com/t/nem2/shared_invite/enQtMzY4MDc2NTg0ODgyLWZmZWRiMjViYTVhZjEzOTA0MzUyMTA1NTA5OWQ0MWUzNTA4NjM5OTJhOGViOTBhNjkxYWVhMWRiZDRkOTE0YmU
