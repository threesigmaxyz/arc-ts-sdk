import { IClientConfig } from '../interfaces/IClientConfig';
import { UserClient } from './UserClient';
import { IProvider } from '../interfaces/IProvider';
import { DefaultProviderUrls } from './ClientFactory';
import { IClient } from '../interfaces/IClient';
import { IUserClient } from '../interfaces/IUserClient';
import { IAssetsClient } from '../interfaces/IAssetsClient';
import { AssetsClient } from './AssetsClient';
import { IFeeClient } from '../interfaces/IFeeClient';
import { FeeClient } from './FeeClient';
import { OperationsClient } from './OperationsClient';
import { IOperationsClient } from '../interfaces/IOperationsClient';
import { VaultClient } from './VaultClient';
import { IVaultClient } from '../interfaces/IVaultClient';
import { INetworkHealth } from '../interfaces/INetworkHealth';
import axios, { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { DepositClient } from './DepositClient';
import { IDepositClient } from '../interfaces/IDepositClient';
import { IMintClient } from '../interfaces/IMintClient';
import { MintClient } from './MintClient';
import { TransferClient } from './TransferClient';
import { ITransferClient } from '../interfaces/ITransferClient';
import { WithdrawClient } from './WithdrawClient';
import { IWithdrawClient } from '../interfaces/IWithdrawClient';
import { JsonRpcProvider } from 'ethers';

/**
 * StarkExpress Web3 Client object wraps all user, asset, mint, transfer, transaction, withdraw, vault, fee, deposit and settlement functionalities.
 */
export class Client implements IClient {
  private userClient: UserClient;
  private assetsClient: AssetsClient;
  private feeClient: FeeClient;
  private operationsClient: OperationsClient;
  private vaultClient: VaultClient;
  private depositClient: DepositClient;
  private mintClient: MintClient;
  private transferClient: TransferClient;
  private withdrawClient: WithdrawClient;

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
    this.vaultClient = new VaultClient(clientConfig);
    this.depositClient = new DepositClient(clientConfig);
    this.mintClient = new MintClient(clientConfig);
    this.transferClient = new TransferClient(clientConfig);
    this.withdrawClient = new WithdrawClient(clientConfig);

    // subclients
    this.user = this.user.bind(this);
    this.assets = this.assets.bind(this);
    this.fees = this.fees.bind(this);
    this.operations = this.operations.bind(this);
    this.vault = this.vault.bind(this);
    this.deposit = this.deposit.bind(this);
    this.mints = this.mints.bind(this);
    this.transfers = this.transfers.bind(this);
    this.withdraws = this.withdraws.bind(this);
    // setters
    this.setCustomProvider = this.setCustomProvider.bind(this);
    this.setDefaultProvider = this.setDefaultProvider.bind(this);
    this.setJsonRpcProvider = this.setJsonRpcProvider.bind(this);
    // getters
    this.getProvider = this.getProvider.bind(this);
  }

  /**
   * Get the deposit-related methods.
   *
   * @returns IDepositClient object.
   */
  public deposit(): IDepositClient {
    return this.depositClient;
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
   * @returns IFeeClient object.
   */
  public fees(): IFeeClient {
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
   * Get the vault-related methods.
   *
   * @returns IVaultClient object.
   */
  public vault(): IVaultClient {
    return this.vaultClient;
  }

  /**
   * Get the mint-related methods.
   *
   * @returns IMintClient object.
   */
  public mints(): IMintClient {
    return this.mintClient;
  }

  /**
   * Get the transfer-related methods.
   *
   * @returns ITransferClient object.
   */
  public transfers(): ITransferClient {
    return this.transferClient;
  }

  /**
   * Get the withdraw-related methods.
   *
   * @returns IWithdrawClient object.
   */
  public withdraws(): IWithdrawClient {
    return this.withdrawClient;
  }

  /**
   * Check the health of the network.
   *
   * @returns INetworkHealth object.
   */
  public async health(): Promise<INetworkHealth> {
    const headers = {
      'Content-Type': 'application/json',
    } as AxiosRequestHeaders;
    let resp: AxiosResponse<string, any> = null;
    try {
      resp = await axios({
        method: 'get',
        url: `${this.clientConfig.provider.url}/healthz`,
        headers: headers,
      });
    } catch (error) {
      if (error.response) {
        // The server responded with a status other than 2xx (e.g., 4xx, 5xx)
        return INetworkHealth.DOWN;
      } else if (error.request) {
        // The request was made but no response was received
        return INetworkHealth.UNKNOWN;
      } else {
        // Something happened in setting up the request that triggered an Error
        return INetworkHealth.DOWN;
      }
    }
    return resp.data === 'Healthy' ? INetworkHealth.UP : INetworkHealth.UNKNOWN;
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
    this.vaultClient.setProvider(provider);
    this.transferClient.setProvider(provider);
    this.mintClient.setProvider(provider);
    this.withdrawClient.setProvider(provider);
    this.depositClient.setProvider(provider);
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
    this.vaultClient.setProvider(provider);
    this.transferClient.setProvider(provider);
    this.mintClient.setProvider(provider);
    this.withdrawClient.setProvider(provider);
    this.depositClient.setProvider(provider);
  }

  /**
   * Set JsonRpc provider.
   *
   * @param provider - a new custom provider to set.
   */
  public setJsonRpcProvider(provider: JsonRpcProvider): void {
    this.userClient.setJsonRpcProvider(provider);
    this.assetsClient.setJsonRpcProvider(provider);
    this.feeClient.setJsonRpcProvider(provider);
    this.operationsClient.setJsonRpcProvider(provider);
    this.vaultClient.setJsonRpcProvider(provider);
    this.mintClient.setJsonRpcProvider(provider);
    this.withdrawClient.setJsonRpcProvider(provider);
  }
}
