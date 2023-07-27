import { IClientConfig } from '../interfaces/IClientConfig';
import { UserClient } from './UserClient';
import { IProvider } from '../interfaces/IProvider';
import { DefaultProviderUrls } from './ClientFactory';
import { IClient } from '../interfaces/IClient';
import { IUserClient } from '../interfaces/IUserClient';

/**
 * StarkExpress Web3 Client object wraps all user, asset, mint, transfer ,transaction, withdraw, vault, fee, deposit and settlement functionalities.
 */
export class Client implements IClient {
  private userClient: UserClient;

  /**
   * Constructor of the Client class.
   *
   * @param clientConfig - client configuration object.
   * @param baseAccount - base account to use for signing transactions (optional).
   */
  public constructor(private clientConfig: IClientConfig) {
    this.userClient = new UserClient(clientConfig);

    // subclients
    this.user = this.user.bind(this);
    // setters
    this.setCustomProvider = this.setCustomProvider.bind(this);
    this.setDefaultProvider = this.setDefaultProvider.bind(this);
    // getters
    this.getProvider = this.getProvider.bind(this);
  }

  /**
   * Get the Wallet related methods.
   *
   * @returns WalletClient object.
   */
  public user(): IUserClient {
    return this.userClient;
  }

  /**
   * Set new custom provider.
   *
   * @param provider - a new custom provider to set.
   */
  public setCustomProvider(provider: IProvider): void {
    this.userClient.setProvider(provider);
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
  }
}
