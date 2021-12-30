import { Account, Deadline, EmptyMessage, Currency, NetworkType, TransferTransaction, TransactionMapping } from 'symbol-sdk';

import { TransactionURI } from '../src/uris/TransactionURI';

const epochAdjustment = 1637848847;
const serializedTransaction = TransferTransaction.create(
    Deadline.create(epochAdjustment),
    Account.generateNewAccount(NetworkType.TEST_NET).address,
    [Currency.PUBLIC.createRelative(10)],
    EmptyMessage,
    NetworkType.TEST_NET
).serialize();

const generationHash = 'ABC'; // replace with network generation hash
const nodeUrl = 'http://localhost:3000';
const webhookUrl = 'http://myapp.local/id';

const transactionURI = new TransactionURI(serializedTransaction, TransactionMapping.createFromPayload, generationHash, nodeUrl, webhookUrl);
console.log(transactionURI.build());
