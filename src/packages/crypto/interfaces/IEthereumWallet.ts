/**
 * Represents a minimalistic Ethereum wallet object
 *
 * @see privateKey - A string representing the base58 encoded private key associated with the account.
 * @see providerUrl - A provider URL for the connection
 */
export interface IEthereumWallet {
  privateKey: string;
  providerUrl: string;
}
