import { Owner, Token, TokenOwner } from '../generated/schema';

export function getOrcreateTokenOwner(token: Token, owner: Owner): TokenOwner {
  const id = token.id.concat(owner.id);

  let tokenOwner = TokenOwner.load(id);
  if (tokenOwner === null) {
    tokenOwner = new TokenOwner(id);
    tokenOwner.token = token.id;
    tokenOwner.owner = owner.id;
  }

  return tokenOwner;
}
