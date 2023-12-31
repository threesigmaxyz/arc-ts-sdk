import { IClientConfig } from '../interfaces/IClientConfig';
import { BaseClient } from './BaseClient';
import { ResponseData } from '../interfaces/ResponseData';
import { IAssetsClient } from '../interfaces/IAssetsClient';
import { IAsset } from '../interfaces/IAsset';
import { IGetAllAssetsFilter } from '../interfaces/IGetAllAssetsFilter';
import { IGetAllEntitiesResponse } from '../interfaces/IGetAllEntitiesResponse';
import {
  AssetApi,
  Configuration,
  DeployAssetModel,
  EnableAssetModel,
  TenantAssetDtoPaginatedResponseDto,
} from '../gen';
import { AxiosResponse } from 'axios';

/**
 * A client class for interacting with the assets API of Arc.
 *
 * @remarks
 * The AssetClient manages retrieving and enabling assets. It extends the BaseClient
 * class and implements the IAssetsClient interface.
 */
export class AssetsClient extends BaseClient implements IAssetsClient {
  private assetsApi: AssetApi;

  /**
   * Constructor of the {@link AssetsClient} class.
   *
   * @param clientConfig - Configuration parameters for the client.
   */
  public constructor(clientConfig: IClientConfig) {
    super(clientConfig);

    // bind generated client
    this.assetsApi = new AssetApi({
      apiKey: clientConfig.apiKey,
      basePath: clientConfig.provider.url,
    } as Configuration);

    // bound methods
    this.getAllAssetsInfo = this.getAllAssetsInfo.bind(this);
    this.getAsset = this.getAsset.bind(this);
    this.deployAsset = this.deployAsset.bind(this);
    this.enableAsset = this.enableAsset.bind(this);
  }

  /**
   * Deploy Asset.
   *
   * @param assetData - The asset data to deploy the asset with
   *
   * @returns a promise that resolves to an object of `ResponseData<IAsset>`.
   */
  public async deployAsset(
    deployAssetData: DeployAssetModel,
  ): Promise<ResponseData<IAsset>> {
    return await this.sanitizeResponse<IAsset>(
      this.assetsApi.deployAsset(deployAssetData),
    );
  }

  /**
   * Get Asset Info by assetId.
   *
   * @param userId - The assetId to get the info for
   *
   * @returns a promise that resolves to an object of IAsset.
   */
  public async getAsset(assetId: string): Promise<ResponseData<IAsset>> {
    return await this.sanitizeResponse<IAsset>(
      this.assetsApi.getAsset(assetId),
    );
  }

  /**
   * Enable Asset by assetId.
   *
   * @param enableAssetData - The assetId to be enabled
   *
   * @returns a promise that resolves to an object of IAsset.
   */
  public async enableAsset(
    enableAssetData: EnableAssetModel,
  ): Promise<ResponseData<IAsset>> {
    return await this.sanitizeResponse<IAsset>(
      this.assetsApi.enableAsset(enableAssetData),
    );
  }

  /**
   * Get Assets Information by Filter.
   *
   * @param filter - The filter used for filtering entries of type `IGetAllAssetsFilter`
   *
   * @returns a promise that resolves to an ab oject of `ResponseData<IGetAllEntitiesResponse<IAsset>>`
   */
  public async getAllAssetsInfo(
    filter: IGetAllAssetsFilter,
  ): Promise<ResponseData<IGetAllEntitiesResponse<IAsset>>> {
    const resp: Promise<
      AxiosResponse<TenantAssetDtoPaginatedResponseDto, undefined>
    > = this.assetsApi.getAllAssets(
      filter.assetId,
      filter.assetType,
      filter.assetTypeComparison,
      filter.assetSymbol,
      filter.assetSymbolComparison,
      filter.pageNumber,
      filter.pageSize,
      filter.sortBy,
    );

    return (await this.sanitizeResponse<TenantAssetDtoPaginatedResponseDto>(
      resp,
    )) as ResponseData<IGetAllEntitiesResponse<IAsset>>;
  }
}
