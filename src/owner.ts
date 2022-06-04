import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Owner } from '../generated/schema';

export function getOrCreateOwner(ownerAddress: Address): Owner {
  let owner = Owner.load(ownerAddress);
  if (owner === null) {
    owner = new Owner(ownerAddress);

    owner.totalTokens = 0;
    owner.totalTransfers = BigInt.zero();
  }

  return owner;
}

export function decrementOwnerTotalTokens(owner: Owner): void {
  owner.totalTokens -= 1;
}

export function incrementOwnerTotalTokens(owner: Owner): void {
  owner.totalTokens += 1;
}

export function incrementOwnerTotalTransfers(owner: Owner): void {
  owner.totalTransfers = owner.totalTransfers.plus(BigInt.fromI32(1));
}
