import { BigInt, Bytes, ethereum, log } from '@graphprotocol/graph-ts';
import { Owner, Token } from '../generated/schema';
import { METADATA_IPFS_URL, METADATA_URL, RESERVED_NFT_COUNT, tokenURIKeys } from './constants';

export function getOrCreateToken(tokenId: BigInt, owner: Owner, event: ethereum.Event): Token {
  const id = Bytes.fromByteArray(Bytes.fromI32(tokenId.toI32()));
  let token = Token.load(id);
  if (token === null) {
    token = new Token(id);
    token.tokenId = tokenId.toI32();

    if (tokenId < BigInt.fromI32(RESERVED_NFT_COUNT)) {
      token.isReserved = true;
      token.uriKey = tokenId.toString()
    } else {
      token.isReserved = false;
      token.uriKey = tokenURIKeys[token.tokenId - RESERVED_NFT_COUNT];
    }

    token.metadataIpfsUrl = METADATA_IPFS_URL + token.uriKey
    token.metadataUrl = METADATA_URL + token.uriKey
    token.totalTransfers = BigInt.zero();
    token.mintedTimestamp = event.block.timestamp;
    token.minter = event.transaction.from;
    token.mintTxHash = event.transaction.hash;
    token.owner = owner.id;
  }

  return token;
}

export function incrementTokenTotalTransfer(token: Token): void {
  token.totalTransfers = token.totalTransfers.plus(BigInt.fromI32(1));
}

export function changeTokenOwner(token: Token, newOwner: Owner): void {
  token.owner = newOwner.id
}
