import { DefaultProviderUrls } from '../web3/ClientFactory';
import { IProvider } from './IProvider';
import { IUserClient } from './IUserClient';

/**
 * Represents the client object.
 *
 * @remarks
 * This interface is used to get handles to different APIs. It also provides methods for setting
 * custom and default providers. The default providers are the global connection URLs
 * for StarkExpress's MAINNET, TESTNET.
 *
 * @see user() - user API client.
 * @see getProvider - A method for getting the current provider.
 * @see setCustomProviders - A method for setting a custom provider.
 * @see setDefaultProvider - A method for setting a new default provider.
 */
export interface IClient {
  user(): IUserClient;
  getProvider(): IProvider;
  setCustomProvider(provider: IProvider): void;
  setDefaultProvider(defaultProvider: DefaultProviderUrls): void;
}
