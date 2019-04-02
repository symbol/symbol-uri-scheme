# nem2-uri-scheme

:warning: This library is experimental, use at your own risk.

NEM URI Scheme library to serve transactions ready to be signed.

This is PoC to validate the proposed [NIP4 Transaction URI Scheme](https://github.com/nemtech/NIP/issues/6). When stable, the repository will be moved to the [nemtech](https://github.com/nemtech) organization.

## Installation

``npm install https://github.com/dgarcia360/nem2-uri-scheme/tarball/master``

## Examples

### Build URI from transaction

```typescript

    import { TransferTransaction, Deadline, Address, PlainMessage, NetworkCurrencyMosaic, NetworkType } from 'nem2-sdk';
    import { TransactionURI, URIFormat } from 'nem2-sdk';

    const transferTransaction = TransferTransaction.create(
        Deadline.create(),
        Address.createFromRawAddress('SAGYCE-QM5SK2-TGFUC5-Z5GZJR-ATKTBS-UQQMMH-KW5B'),
        [NetworkCurrencyMosaic.createRelative(10)],
        PlainMessage.create('hello'),
        NetworkType.MIJIN_TEST
    );
    const transactionURI = TransactionURI.fromTransaction(URIFormat.serialized, transferTransaction, 'test','http://localhost:3000').build();
    console.log(transactionURI);
```

### Build URI from serialized transaction

```typescript
    import { TransferTransaction, Deadline, Address, PlainMessage, NetworkCurrencyMosaic, NetworkType } from 'nem2-sdk';
    import { TransactionURI, URIFormat } from 'nem2-sdk';

    const serializedTransaction = TransferTransaction.create(
        Deadline.create(),
        Address.createFromRawAddress('SAGYCE-QM5SK2-TGFUC5-Z5GZJR-ATKTBS-UQQMMH-KW5B'),
        [NetworkCurrencyMosaic.createRelative(10)],
        PlainMessage.create('hello'),
        NetworkType.MIJIN_TEST
    ).serialized();
    const transactionURI = new TransactionURI(URIFormat.serialized, serializedTransaction, 'test', 'http://localhost:3000').build();
    console.log(transactionURI);
```

### Build URI from DTO

```typescript
    import { TransferTransaction, Deadline, Address, PlainMessage, NetworkCurrencyMosaic, NetworkType } from 'nem2-sdk';
    import { TransactionURI, URIFormat } from 'nem2-sdk';

    const transactionDTO = TransferTransaction.create(
        Deadline.create(),
        Address.createFromRawAddress('SAGYCE-QM5SK2-TGFUC5-Z5GZJR-ATKTBS-UQQMMH-KW5B'),
        [NetworkCurrencyMosaic.createRelative(10)],
        PlainMessage.create('hello'),
        NetworkType.MIJIN_TEST
    ).toJSON();
    const transactionURI = new TransactionURI(URIFormat.DTO, transactionDTO, 'test','http://localhost:3000').build();
    console.log(transactionURI);
```

### Create transaction from URI

```typescript
    const transactionURI = new TransactionURI(URIFormat.serialized, serializedTransaction).build();
    const transaction = transactionURI.toTransaction();
```

## License

Licensed under the [Apache License](LICENSE.md), Version 2.
