import { Address, Bytes } from '@graphprotocol/graph-ts';
import { Apetimism, Token, Transfer } from '../generated/schema';
import { Transfer as TransferEvent } from '../generated/ApetimismNFT/ApetimismNFT';

export function createTransfer(event: TransferEvent, token: Token, ape: Apetimism): Transfer {
  const id = event.transaction.hash.concat(Bytes.fromByteArray(Bytes.fromBigInt(event.logIndex)));;

  let transfer = Transfer.load(id);
  if (transfer === null) {
    transfer = new Transfer(id);

    transfer.index = ape.totalTransfers;
    transfer.from = event.params.from;
    transfer.to = event.params.to;
    transfer.token = token.id;
    transfer.timestamp = event.block.timestamp;
    transfer.blockNumber = event.block.number;
    transfer.logIndex = event.logIndex;
    transfer.txHash = event.transaction.hash;

    if (event.params.from.equals(Address.zero())) {
      transfer.isMinted = true;
    } else {
      transfer.isMinted = false;
    }
  }

  return transfer;
}
