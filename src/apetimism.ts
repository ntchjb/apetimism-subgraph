import { BigInt, Bytes } from '@graphprotocol/graph-ts';
import { Apetimism } from '../generated/schema';
import { MAX_SUPPLY, RESERVED_NFT_COUNT, TEAM_NFT_COUNT } from './constants';

export function getOrCreateApetimism(): Apetimism {
  const ID = Bytes.fromI32(1);
  let ape = Apetimism.load(ID);
  if (ape === null) {
    ape = new Apetimism(ID);

    ape.reservedMintingStartTimestamp = 0;
    ape.teamMintingStartTimestamp = 0;
    ape.publicMintingStartTimestamp = 0;
    ape.mintingEndTimestamp = 0;
    ape.revealedTimestamp = 0;
    ape.totalTokens = 0;
    ape.totalOwners = 0;
    ape.totalTransfers = BigInt.zero();
  }

  return ape;
}

export function incrementTotalTokens(ape: Apetimism, timestamp: i32): void {
  ape.totalTokens += 1;

  if (ape.totalTokens == 1) {
    ape.reservedMintingStartTimestamp = timestamp;
  } else if (ape.totalTokens == RESERVED_NFT_COUNT + 1) {
    ape.teamMintingStartTimestamp = timestamp;
  } else if (ape.totalTokens == RESERVED_NFT_COUNT + TEAM_NFT_COUNT + 1) {
    ape.publicMintingStartTimestamp = timestamp;
  } else if (ape.totalTokens == MAX_SUPPLY) {
    ape.mintingEndTimestamp = timestamp;
  }
}

export function setRevealedTimestamp(ape: Apetimism, timestamp: i32): void {
  ape.revealedTimestamp = timestamp;
}

export function incrementTotalTransfers(ape: Apetimism): void {
  ape.totalTransfers = ape.totalTransfers.plus(BigInt.fromI32(1));
}

export function decrementTotalOwners(ape: Apetimism): void {
  ape.totalOwners -= 1;
}

export function incrementTotalOwners(ape: Apetimism): void {
  ape.totalOwners += 1;
}
