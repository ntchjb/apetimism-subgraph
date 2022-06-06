import { Transfer as TransferEvent } from '../generated/ApetimismNFT/ApetimismNFT';
import { Transaction } from '../generated/schema';

export function getOrCreateTransaction(event: TransferEvent): Transaction {
  let tx = Transaction.load(event.transaction.hash);

  if (tx === null) {
    tx = new Transaction(event.transaction.hash);

    tx.totalMints = 0;
    tx.totalTransfers = 0;
    tx.value = event.transaction.value;
    tx.from = event.transaction.from;
    tx.to = event.transaction.to!;
    tx.gasLimit = event.transaction.gasLimit;
    tx.gasPrice = event.transaction.gasPrice;
  }

  return tx;
}

export function incrementTxTotalMint(tx: Transaction): void {
  tx.totalMints += 1;
}

export function incrementTxTotalTransfer(tx: Transaction): void {
  tx.totalTransfers += 1;
}
