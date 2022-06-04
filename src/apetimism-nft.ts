import { Address } from '@graphprotocol/graph-ts';
import { Revealed, RoundChanged, TotalMintedChanged, Transfer } from '../generated/ApetimismNFT/ApetimismNFT';
import {
  decrementTotalOwners,
  getOrCreateApetimism,
  incrementTotalOwners,
  incrementTotalTokens,
  incrementTotalTransfers,
  setRevealedTimestamp,
} from './apetimism';
import {
  decrementOwnerTotalTokens,
  getOrCreateOwner,
  incrementOwnerTotalTokens,
  incrementOwnerTotalTransfers,
} from './owner';
import { createRoundChanged } from './roundChanged';
import { changeTokenOwner, getOrCreateToken, incrementTokenTotalTransfer } from './token';
import { getOrcreateTokenOwner } from './tokenOwner';
import { createTotalMintChanged } from './totalMintChanged';
import { createTransfer } from './transfer';

export function handleRevealed(event: Revealed): void {
  const ape = getOrCreateApetimism();

  setRevealedTimestamp(ape, event.block.timestamp.toI32());

  ape.save();
}

export function handleRoundChanged(event: RoundChanged): void {
  let roundChanged = createRoundChanged(event);

  roundChanged.save();
}

export function handleTotalMintedChanged(event: TotalMintedChanged): void {
  let totalMintedChanged = createTotalMintChanged(event);

  totalMintedChanged.save();
}

export function handleTransfer(event: Transfer): void {
  const from = event.params.from;

  let ape = getOrCreateApetimism();
  incrementTotalTransfers(ape);

  let owner = getOrCreateOwner(event.params.to);
  if (event.params.from != event.params.to) {
    incrementOwnerTotalTokens(owner);
    if (owner.totalTokens == 1) {
      incrementTotalOwners(ape);
    }
  }

  let token = getOrCreateToken(event.params.tokenId, owner, event);
  incrementTokenTotalTransfer(token);
  changeTokenOwner(token, owner);

  let tokenOwner = getOrcreateTokenOwner(token, owner);

  if (from.equals(Address.zero())) {
    incrementTotalTokens(ape, event.block.timestamp.toI32());
  } else {
    let previousOwner = getOrCreateOwner(event.params.from);
    if (event.params.from != event.params.to) {
      decrementOwnerTotalTokens(previousOwner);
      incrementOwnerTotalTransfers(previousOwner);

      if (previousOwner.totalTokens == 0) {
        decrementTotalOwners(ape);
      }
    }

    previousOwner.save();
  }

  let transfer = createTransfer(event, token, ape);

  ape.save();
  owner.save();
  token.save();
  tokenOwner.save();
  transfer.save();
}
