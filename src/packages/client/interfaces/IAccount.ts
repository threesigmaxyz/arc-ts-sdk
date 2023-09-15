/**
 * Represents the structure of an Ethereum Account object.
 *
 * @see address - A string representing the address of the account (including 0x-prefix).
 * @see publicKey - A string representing the base58 encoded public key associated with the account (including 0x-prefix).
 * @see secretKey - A string representing the base58 encoded private key associated with the account (including 0x-prefix).
 */
export interface IAccount {
  address: string;
  publicKey: string;
  secretKey: string;
}
