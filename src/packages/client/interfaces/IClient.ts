import { DefaultProviderUrls } from '../clients/ClientFactory';
import { IAssetsClient } from './IAssetsClient';
import { IFeeClient } from './IFeeClient';
import { IOperationsClient } from './IOperationsClient';
import { IProvider } from './IProvider';
import { IUserClient } from './IUserClient';
import { IVaultClient } from './IVaultClient';
import { IMintClient } from './IMintClient';
import { IMarketplaceClient } from './IMarketplaceClient';

/**
 * Represents the client object.
 *
 * @remarks
 * This interface is used to get handles to different APIs. It also provides methods for setting
 * custom and default providers. The default providers are the global connection URLs
 * for Arc's MAINNET, TESTNET.
 *
 * @see user() - user API client.
 * @see assets() - assets API client.
 * @see fees() -fees API client.
 * @see mints() -mints API client.
 * @see operations() - operations API client.
 * @see vault() - vault API client.
 * @see marketrplace() - marketplace API client.
 * @see getProvider - A method for getting the current provider.
 * @see setCustomProviders - A method for setting a custom provider.
 * @see setDefaultProvider - A method for setting a new default provider.
 */
export interface IClient {
  user(): IUserClient;
  assets(): IAssetsClient;
  fees(): IFeeClient;
  mints(): IMintClient;
  operations(): IOperationsClient;
  vault(): IVaultClient;
  marketplace(): IMarketplaceClient;
  getProvider(): IProvider;
  setCustomProvider(provider: IProvider): void;
  setDefaultProvider(defaultProvider: DefaultProviderUrls): void;
}
