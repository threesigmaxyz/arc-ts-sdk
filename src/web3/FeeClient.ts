import { IClientConfig } from '../interfaces/IClientConfig';
import { BaseClient } from './BaseClient';
import { IStarkExpressAccount } from '../interfaces/IStarkExpressAccount';
import { ResponseData } from '../interfaces/ResponseData';
import { IFeeModel } from '../interfaces/IFeeModel';
import { IFeeClient } from '../interfaces/IFeeClient';
import { Configuration, ConfigureFeeModel, FeeApi } from '../gen';

/**
 * A client class for interacting with the fee API of StarkExpress.
 *
 * @remarks
 * The FeeClient manages retrieving and setting fees. It extends the BaseClient
 * class and implements the IFeeClient interface.
 */
export class FeeClient extends BaseClient implements IFeeClient {
  private baseStarkExpressAccount?: IStarkExpressAccount;
  private feeApi: FeeApi;

  /**
   * Constructor of the {@link FeeClient} class.
   *
   * @param clientConfig - Configuration parameters for the client.
   */
  public constructor(clientConfig: IClientConfig) {
    super(clientConfig);

    // bind generated client
    this.feeApi = new FeeApi({
      apiKey: clientConfig.apiKey,
      basePath: clientConfig.provider.url,
    } as Configuration);

    // bound methods
    this.setBaseAccount = this.setBaseAccount.bind(this);
    this.getBaseAccount = this.getBaseAccount.bind(this);
    this.configureFeeModel = this.configureFeeModel.bind(this);
    this.getFeeModel = this.getFeeModel.bind(this);
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
   * Configure Fee Model
   *
   * @param feeModelData - The fee model data to configure with
   *
   * @returns a promise that resolves to an object of `ResponseData<IFeeModel>`.
   */
  public async configureFeeModel(
    feeModelData: ConfigureFeeModel,
  ): Promise<ResponseData<IFeeModel>> {
    return await this.sanitizeResponse<IFeeModel>(
      this.feeApi.configureFeeModel(feeModelData),
    );
  }

  /**
   * Get Fee Model Info by feeId.
   *
   * @param feeId - The feeId to get the fee model for
   *
   * @returns a promise that resolves to an object of IFeeModel.
   */
  public async getFeeModel(feeId: string): Promise<ResponseData<IFeeModel>> {
    return await this.sanitizeResponse<IFeeModel>(
      this.feeApi.getFeeModel(feeId),
    );
  }
}
