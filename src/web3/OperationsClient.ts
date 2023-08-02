import { IClientConfig } from '../interfaces/IClientConfig';
import { BaseClient } from './BaseClient';
import { IStarkExpressAccount } from '../interfaces/IStarkExpressAccount';
import { ResponseData } from '../interfaces/ResponseData';
import { IOperationsClient } from '../interfaces/IOperationsClient';
import { IDepositDetails } from '../interfaces/IDepositDetails';
import { Configuration, DepositApi, DepositDetailsModel } from '../gen';

/**
 * A client class for interacting with the operations API of StarkExpress.
 *
 * @remarks
 * The OperationsClient manages deposits, mints, transactions, transfers, withdraws. It extends the BaseClient
 * class and implements the IOperationsClient interface.
 */
export class OperationsClient extends BaseClient implements IOperationsClient {
  private baseStarkExpressAccount?: IStarkExpressAccount;
  private depositsApi: DepositApi;

  /**
   * Constructor of the {@link OperationsClient} class.
   *
   * @param clientConfig - Configuration parameters for the client.
   */
  public constructor(clientConfig: IClientConfig) {
    super(clientConfig);

    // bind generated client
    this.depositsApi = new DepositApi({
      apiKey: clientConfig.apiKey,
      basePath: clientConfig.provider.url,
    } as Configuration);

    // bound methods
    this.setBaseAccount = this.setBaseAccount.bind(this);
    this.getBaseAccount = this.getBaseAccount.bind(this);
    this.getDepositDetailsFotAsset = this.getDepositDetailsFotAsset.bind(this);
  }

  /**
   * Sets a provided account as the default (base) account for the sdk.
   *
   * @param baseAccount - An {@link IStarkExpressAccount} to be set as the base account.
   *
   * @returns A Promise that resolves to `void` when the base account has been set successfully.
   */
  public async setBaseAccount(
    baseAccount: IStarkExpressAccount,
  ): Promise<void> {
    this.baseStarkExpressAccount = baseAccount;
  }

  /**
   * Retrieves the default (base) account of the sdk.
   *
   * @returns The base {@link IStarkExpressAccount} set. If no default account is set, it returns `null`.
   */
  public getBaseAccount(): IStarkExpressAccount | null {
    return this.baseStarkExpressAccount;
  }

  /**
   * Get Deposit Details for asset
   *
   * @param depositDetails - The deposit details to be retrieved
   *
   * @returns a promise that resolves to an object of `ResponseData<IDepositDetails>`.
   */
  public async getDepositDetailsFotAsset(
    depositDetails: DepositDetailsModel,
  ): Promise<ResponseData<IDepositDetails>> {
    return await this.sanitizeResponse<IDepositDetails>(
      this.depositsApi.depositDetails(depositDetails),
    );
  }
}
