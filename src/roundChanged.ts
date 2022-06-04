import { Bytes } from '@graphprotocol/graph-ts';
import { RoundChanged as RoundChangedEvent } from '../generated/ApetimismNFT/ApetimismNFT';
import { RoundChanged } from '../generated/schema';

export function createRoundChanged(event: RoundChangedEvent): RoundChanged {
  const id = event.transaction.hash.concat(Bytes.fromByteArray(Bytes.fromBigInt(event.logIndex)));

  let roundChanged = new RoundChanged(id);

  roundChanged.logIndex = event.logIndex;
  roundChanged.blockNumber = event.block.number;
  roundChanged.txHash = event.transaction.hash;
  roundChanged.timestamp = event.block.timestamp.toI32();
  roundChanged.roundType = event.params.param0;

  return roundChanged
}
