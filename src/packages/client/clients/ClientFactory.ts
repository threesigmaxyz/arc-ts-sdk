import { IProvider } from '../interfaces/IProvider';
import { Client } from './Client';
import { IClientConfig } from '../interfaces/IClientConfig';

/** Global connection urls, for Arc's MAINNET, TESTNET */
export enum DefaultProviderUrls {
  MAINNET = 'https://api.onarc.io',
  TESTNET = 'https://testnet-api.onarc.io',
}

/**
 * Arc Web3 ClientFactory class allows you to easily initialize a client to
 * connect to the Arc blockchain.
 *
 * @remarks
 * The client can be initialized using a default provider (MAINNET, TESTNET)
 * or a custom provider.
 */
export class ClientFactory {
  /**
   * Creates a default client using a default provider (MAINNET, TESTNET).
   *
   * @param defaultProvider - Default provider to be used by the client.
   * @param apiKey - An api key to be used by the client.
   *
   * @returns A promise that resolves to a Client object.
   */
  public static async createDefaultClient(
    defaultProvider: DefaultProviderUrls,
    apiKey: string,
  ): Promise<Client> {
    let publicProviderUrl = defaultProvider.toString();

    const provider = {
      url: publicProviderUrl,
    } as IProvider;

    const client: Client = new Client({
      apiKey: apiKey,
      provider,
    } as IClientConfig);

    return client;
  }

  /**
   * Initializes a new client using a a provider and an api key.
   *
   * @param provider - A provider to be used by the client.
   * @param apiKey - An api key to be used by the client.
   * @param jsonRpcProvider - The ethereum JSON-RPC provider
   * @returns A promise that resolves to a Client object.
   */
  public static async createCustomClient(
    provider: IProvider,
    apiKey: string,
  ): Promise<Client> {
    const client: Client = new Client({
      apiKey,
      provider,
    } as IClientConfig);

    return client;
  }
}
