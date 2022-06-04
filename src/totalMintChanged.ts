import { Bytes } from '@graphprotocol/graph-ts';
import { TotalMintedChanged as TotalMintedChangedEvent } from '../generated/ApetimismNFT/ApetimismNFT';
import { TotalMintedChanged } from '../generated/schema';

export function createTotalMintChanged(event: TotalMintedChangedEvent): TotalMintedChanged {
  const id = event.transaction.hash.concat(Bytes.fromByteArray(Bytes.fromBigInt(event.logIndex)));;

  let totalMintedChanged = new TotalMintedChanged(id);

  totalMintedChanged.timestamp = event.block.timestamp.toI32();
  totalMintedChanged.totalMinted = event.params.param0.toI32();

  return totalMintedChanged;
}
