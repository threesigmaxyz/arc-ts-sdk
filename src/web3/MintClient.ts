import { IClientConfig } from '../interfaces/IClientConfig';
import { BaseClient } from './BaseClient';
import {
  BatchMintRequestModel,
  Configuration,
  MintApi,
  VaultDto,
} from '../gen';
import { IMintClient } from '../interfaces/IMintClient';
import { ResponseData } from '../interfaces/ResponseData';

/**
 * A client class for interacting with the Mint API of Arc.
 *
 * @remarks
 * The MintClient manages mints. It extends the BaseClient
 * class and implements the IMintClient interface.
 */
export class MintClient extends BaseClient implements IMintClient {
  private mintApi: MintApi;

  /**
   * Constructor of the {@link MintClient} class.
   *
   * @param clientConfig - Configuration parameters for the client.
   */
  public constructor(clientConfig: IClientConfig) {
    super(clientConfig);

    // bind generated client
    this.mintApi = new MintApi({
      apiKey: clientConfig.apiKey,
      basePath: clientConfig.provider.url,
    } as Configuration);

    // bound methods
    this.mintAssets = this.mintAssets.bind(this);
  }

  /**
   * Mint a batch of assets for one or multiple users.
   *
   * @param mintData - The request model to issue a batch of mints
   *
   * @returns a promise that resolves to an object of `ResponseData<{ [p: string]: Array<VaultDto> }>`.
   */
  public async mintAssets(
    mintData: BatchMintRequestModel,
  ): Promise<ResponseData<{ [p: string]: Array<VaultDto> }>> {
    return await this.sanitizeResponse<{ [key: string]: Array<VaultDto> }>(
      this.mintApi.mintAssets(mintData),
    );
  }
}
