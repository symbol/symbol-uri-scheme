# nem2-uri-scheme

[![npm version](https://badge.fury.io/js/nem2-uri-scheme.svg)](https://badge.fury.io/js/nem2-uri-scheme)
[![Build Status](https://travis-ci.org/nemfoundation/nem2-uri-scheme.svg?branch=master)](https://travis-ci.org/dgarcia360/nem2-uri-scheme)
[![Slack](https://img.shields.io/badge/chat-on%20slack-green.svg)](https://nem2.slack.com/messages/CB0UU89GS//)

:warning: This library is experimental, use at your own risk.

NEM URI Scheme generator to serve transactions ready to be signed.

This is a PoC to validate the proposed [NIP2 Transaction URI Scheme](https://github.com/nemtech/NIP/issues/6). When stable, the repository will be moved to the [nemtech](https://github.com/nemtech) organization.

## Installation

``npm install nem2-uri-scheme``

## Usage

### Transaction to URI

```typescript
import { TransferTransaction, Deadline, Address, PlainMessage, NetworkCurrencyMosaic, NetworkType } from 'nem2-sdk';
import { TransactionURI, URIFormat } from 'nem2-uri-scheme';

const serializedTransaction = TransferTransaction.create(
    Deadline.create(),
    Address.createFromRawAddress('SAGYCE-QM5SK2-TGFUC5-Z5GZJR-ATKTBS-UQQMMH-KW5B'),
    [NetworkCurrencyMosaic.createRelative(10)],
    PlainMessage.create('hello'),
    NetworkType.MIJIN_TEST
).serialize();
const transactionURI = new TransactionURI(serializedTransaction,'test','http://localhost:3000').build();
```


### URI to Transaction

```typescript
import { TransactionURI } from 'nem2-uri-scheme';

    const serializedTransaction = 'AA00000000000000000000000000000000000000000000000000000000000000000000000000000' +
        '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' +
        '000000000000000003905441000000000000000007AF3B3E16000000900D81120CEC95A998B41773D3653104D530CA908318755BA' +
        '10600010068656C6C6F44B262C46CEABB858096980000000000';
    const URI = 'web+nem://transaction?data='+ serializedTransaction + '&generationHash=test' +
        '&endpoint=http://localhost:3000';
    const transactionURI = TransactionURI.fromURI(URI);
    const transaction = transactionURI.toTransaction();
```

Find advanced examples in the [docs](https://github.com/dgarcia360/nem2-uri-scheme/wiki/).

## License

Licensed under the [Apache License](LICENSE.md), Version 2.
