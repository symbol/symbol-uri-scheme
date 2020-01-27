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
