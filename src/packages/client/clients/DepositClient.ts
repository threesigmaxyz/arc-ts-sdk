import { IClientConfig } from '../interfaces/IClientConfig';
import { BaseClient } from './BaseClient';
import {
  Configuration,
  DepositDetailsDto,
  DepositApi,
  DepositDetailsModel,
} from '../gen';
import { IDepositClient } from '../interfaces/IDepositClient';
import { ResponseData } from '../interfaces/ResponseData';

/**
 * A client class for interacting with the Deposit Assets API of Arc.
 *
 * @remarks
 * The DepositClient manages deposits. It extends the BaseClient
 * class and implements the IDepositClient interface.
 */
export class DepositClient extends BaseClient implements IDepositClient {
  private depositApi: DepositApi;

  /**
   * Constructor of the {@link DepositClient} class.
   *
   * @param clientConfig - Configuration parameters for the client.
   */
  public constructor(clientConfig: IClientConfig) {
    super(clientConfig);

    // bind generated client
    this.depositApi = new DepositApi({
      apiKey: clientConfig.apiKey,
      basePath: clientConfig.provider.url,
    } as Configuration);

    // bound methods
    this.getDepositDetails = this.getDepositDetails.bind(this);
  }

  public async getDepositDetails(
    depositData: DepositDetailsModel,
  ): Promise<ResponseData<DepositDetailsDto>> {
    return await this.sanitizeResponse<DepositDetailsDto>(
      this.depositApi.depositDetails(depositData),
    );
  }
}
