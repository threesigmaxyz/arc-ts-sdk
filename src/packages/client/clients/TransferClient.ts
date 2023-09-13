import { IClientConfig } from '../interfaces/IClientConfig';
import { BaseClient } from './BaseClient';
import {
  Configuration,
  TransferApi,
  TransferDetailsDto,
  TransferDetailsModel,
  TransferModel,
  VaultDto,
} from '../gen';
import { ResponseData } from '../interfaces/ResponseData';
import { ITransferClient } from '../interfaces/ITransferClient';
import { AxiosResponse } from 'axios';

/**
 * A client class for interacting with the Transfer API of Arc.
 *
 * @remarks
 * The TransferClient manages transfers. It extends the BaseClient
 * class and implements the ITransferClient interface.
 */
export class TransferClient extends BaseClient implements ITransferClient {
  private transferApi: TransferApi;

  /**
   * Constructor of the {@link TransferClient} class.
   *
   * @param clientConfig - Configuration parameters for the client.
   */
  public constructor(clientConfig: IClientConfig) {
    super(clientConfig);

    // bind generated client
    this.transferApi = new TransferApi({
      apiKey: clientConfig.apiKey,
      basePath: clientConfig.provider.url,
    } as Configuration);

    // bound methods
    this.transferAsset = this.transferAsset.bind(this);
    this.getTransferDetails = this.getTransferDetails.bind(this);
  }

  /**
   * Transfer assets from one user to another
   *
   *
   * @returns a promise that resolves to an object of `ResponseData<{ Array<VaultDto> }>`.
   * @param transferModel - Request model to transfer assets in the Arc API
   */
  public async transferAsset(
    transferModel: TransferModel,
  ): Promise<ResponseData<Array<VaultDto>>> {
    // Send transfer
    return await this.sanitizeResponse<Array<VaultDto>>(
      this.transferApi.transfer(transferModel),
    );
  }

  public async getTransferDetails(
    transferDetailsModel: TransferDetailsModel,
  ): Promise<ResponseData<TransferDetailsDto>> {
    const resp: Promise<AxiosResponse<TransferDetailsDto, undefined>> =
      this.transferApi.transferDetails(transferDetailsModel);
    return (await this.sanitizeResponse(
      resp,
    )) as ResponseData<TransferDetailsDto>;
  }
}
