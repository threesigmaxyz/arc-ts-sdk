import { IClientConfig } from '../interfaces/IClientConfig';
import { BaseClient } from './BaseClient';
import { trySafeExecute } from '../utils/retryExecuteFunction';
import { IStarkExpressAccount } from '../interfaces/IStarkExpressAccount';
import { ResponseData } from '../interfaces/ResponseData';
import { IGetDepositDetailsPayload } from '../interfaces/IGetDepositDetailsPayload';
import { IOperationsClient } from '../interfaces/IOperationsClient';
import { IDepositDetails } from '../interfaces/IDepositDetails';

/**
 * A client class for interacting with the operations API of StarkExpress.
 *
 * @remarks
 * The OperationsClient manages deposits, mints, transactions, transfers, withdraws. It extends the BaseClient
 * class and implements the IOperationsClient interface.
 */
export class OperationsClient extends BaseClient implements IOperationsClient {
  private baseStarkExpressAccount?: IStarkExpressAccount;

  /**
   * Constructor of the {@link OperationsClient} class.
   *
   * @param clientConfig - Configuration parameters for the client.
   */
  public constructor(clientConfig: IClientConfig) {
    super(clientConfig);

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
   * @param depositDetailsPayload - The deposit details to be retrieved
   *
   * @returns a promise that resolves to an object of `ResponseData<IDepositDetails>`.
   */
  public async getDepositDetailsFotAsset(
    depositDetailsPayload: IGetDepositDetailsPayload,
  ): Promise<ResponseData<IDepositDetails>> {
    const body = {
      ...depositDetailsPayload,
      dataAvailabilityMode:
        depositDetailsPayload.dataAvailabilityMode.toString(),
    };

    if (this.clientConfig.retryStrategyOn) {
      return await trySafeExecute<ResponseData<IDepositDetails>>(
        this.doGenericPostCall,
        [`${this.getProvider().url}/vaults/deposit-details`, body],
      );
    } else {
      return await this.doGenericPostCall<IDepositDetails>(
        `${this.getProvider().url}/vaults/deposit-details`,
        body,
      );
    }
  }
}
