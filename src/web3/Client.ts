import { IClientConfig } from '../interfaces/IClientConfig';
import { UserClient } from './UserClient';
import { IProvider } from '../interfaces/IProvider';
import { DefaultProviderUrls } from './ClientFactory';
import { IClient } from '../interfaces/IClient';
import { IUserClient } from '../interfaces/IUserClient';
import { IAssetsClient } from '../interfaces/IAssetsClient';
import { AssetsClient } from './AssetsClient';
import { IFeeModelClient } from '../interfaces/IFeeModelClient';
import { FeeClient } from './FeeClient';
import { OperationsClient } from './OperationsClient';
import { IOperationsClient } from '../interfaces/IOperationsClient';

/**
 * StarkExpress Web3 Client object wraps all user, asset, mint, transfer, transaction, withdraw, vault, fee, deposit and settlement functionalities.
 */
export class Client implements IClient {
  private userClient: UserClient;
  private assetsClient: AssetsClient;
  private feeClient: FeeClient;
  private operationsClient: OperationsClient;

  /**
   * Constructor of the Client class.
   *
   * @param clientConfig - client configuration object.
   * @param baseAccount - base account to use for signing transactions (optional).
   */
  public constructor(private clientConfig: IClientConfig) {
    this.userClient = new UserClient(clientConfig);
    this.assetsClient = new AssetsClient(clientConfig);
    this.feeClient = new FeeClient(clientConfig);
    this.operationsClient = new OperationsClient(clientConfig);

    // subclients
    this.user = this.user.bind(this);
    this.assets = this.assets.bind(this);
    this.fees = this.fees.bind(this);
    this.operations = this.operations.bind(this);
    // setters
    this.setCustomProvider = this.setCustomProvider.bind(this);
    this.setDefaultProvider = this.setDefaultProvider.bind(this);
    // getters
    this.getProvider = this.getProvider.bind(this);
  }

  /**
   * Get the user-related methods.
   *
   * @returns IUserClient object.
   */
  public user(): IUserClient {
    return this.userClient;
  }

  /**
   * Get the assets-related methods.
   *
   * @returns IAssetsClient object.
   */
  public assets(): IAssetsClient {
    return this.assetsClient;
  }

  /**
   * Get the fee-related methods.
   *
   * @returns IFeeModelClient object.
   */
  public fees(): IFeeModelClient {
    return this.feeClient;
  }

  /**
   * Get the operations-related methods.
   *
   * @returns IOperationsClient object.
   */
  public operations(): IOperationsClient {
    return this.operationsClient;
  }

  /**
   * Set new custom provider.
   *
   * @param provider - a new custom provider to set.
   */
  public setCustomProvider(provider: IProvider): void {
    this.userClient.setProvider(provider);
    this.assetsClient.setProvider(provider);
    this.feeClient.setProvider(provider);
    this.operationsClient.setProvider(provider);
  }

  /**
   * Get the currently set provider.
   *
   * @returns the currently set provider.
   */
  public getProvider(): IProvider {
    return this.clientConfig.provider;
  }

  /**
   * Set a default provider.
   *
   * @param provider - The default provider to set.
   */
  public setDefaultProvider(defaultProvider: DefaultProviderUrls): void {
    const provider = {
      url: defaultProvider.toString(),
    } as IProvider;
    this.userClient.setProvider(provider);
    this.assetsClient.setProvider(provider);
    this.feeClient.setProvider(provider);
    this.operationsClient.setProvider(provider);
  }
}
