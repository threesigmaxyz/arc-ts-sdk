import { IClientConfig } from '../interfaces/IClientConfig';
import { BaseClient } from './BaseClient';
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
    this.configureFeeModel = this.configureFeeModel.bind(this);
    this.getFeeModel = this.getFeeModel.bind(this);
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
