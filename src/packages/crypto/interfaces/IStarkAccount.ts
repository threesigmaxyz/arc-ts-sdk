/**
 * Represents the structure of a Stark account object.
 *
 * @see publicKey - A string representing the base58 encoded public key associated with the account.
 * @see secretKey - A string representing the base58 encoded private key associated with the account.
 */
export interface IStarkAccount {
  publicKey: string;
  secretKey: string;
}
