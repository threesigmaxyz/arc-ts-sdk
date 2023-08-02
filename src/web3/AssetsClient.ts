import { IClientConfig } from '../interfaces/IClientConfig';
import { BaseClient } from './BaseClient';
import { trySafeExecute } from '../utils/retryExecuteFunction';
import { IStarkExpressAccount } from '../interfaces/IStarkExpressAccount';
import { ResponseData } from '../interfaces/ResponseData';
import { IAssetsClient } from '../interfaces/IAssetsClient';
import { IAsset } from '../interfaces/IAsset';
import { IGetAllAssetsFilter } from '../interfaces/IGetAllAssetsFilter';
import { IGetAllEntitiesResponse } from '../interfaces/IGetAllEntitiesResponse';
import { IDeployAssetPayload } from '../interfaces/IDeployAssetPayload';

/**
 * A client class for interacting with the assets API of StarkExpress.
 *
 * @remarks
 * The AssetClient manages retrieving and enabling assets. It extends the BaseClient
 * class and implements the IAssetsClient interface.
 */
export class AssetsClient extends BaseClient implements IAssetsClient {
  private baseStarkExpressAccount?: IStarkExpressAccount;

  /**
   * Constructor of the {@link AssetsClient} class.
   *
   * @param clientConfig - Configuration parameters for the client.
   */
  public constructor(clientConfig: IClientConfig) {
    super(clientConfig);

    // bound methods
    this.setBaseAccount = this.setBaseAccount.bind(this);
    this.getBaseAccount = this.getBaseAccount.bind(this);
    this.getAllAssetsInfo = this.getAllAssetsInfo.bind(this);
    this.getAsset = this.getAsset.bind(this);
    this.deployAsset = this.deployAsset.bind(this);
    this.enableAsset = this.enableAsset.bind(this);
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
   * Deploy Asset.
   *
   * @param assetData - The asset data to deploy the asset with
   *
   * @returns a promise that resolves to an object of `ResponseData<IAsset>`.
   */
  public async deployAsset(
    assetData: IDeployAssetPayload,
  ): Promise<ResponseData<IAsset>> {
    const body = { ...assetData, type: assetData.type.toString() };

    if (this.clientConfig.retryStrategyOn) {
      return await trySafeExecute<ResponseData<IAsset>>(
        this.doGenericPostCall,
        [`${this.getProvider().url}/assets/deploy`, body],
      );
    } else {
      return await this.doGenericPostCall<IAsset>(
        `${this.getProvider().url}/assets/deploy`,
        body,
      );
    }
  }

  /**
   * Get Asset Info by assetId.
   *
   * @param userId - The assetId to get the info for
   *
   * @returns a promise that resolves to an object of IAsset.
   */
  public async getAsset(assetId: string): Promise<ResponseData<IAsset>> {
    if (this.clientConfig.retryStrategyOn) {
      return await trySafeExecute<ResponseData<IAsset>>(this.doGenericGetCall, [
        `${this.getProvider().url}/assets/${assetId}`,
      ]);
    } else {
      return await this.doGenericGetCall<IAsset>(
        `${this.getProvider().url}/assets/${assetId}`,
      );
    }
  }

  /**
   * Enable Asset by assetId.
   *
   * @param userId - The assetId to be enabled
   *
   * @returns a promise that resolves to an object of IAsset.
   */
  public async enableAsset(assetId: string): Promise<ResponseData<IAsset>> {
    const body = {
      assetId,
    };
    if (this.clientConfig.retryStrategyOn) {
      return await trySafeExecute<ResponseData<IAsset>>(
        this.doGenericPostCall,
        [`${this.getProvider().url}/assets`, body],
      );
    } else {
      return await this.doGenericPostCall<IAsset>(
        `${this.getProvider().url}/assets`,
        body,
      );
    }
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
    let queryBuilder = {};
    if (filter.assetId) {
      queryBuilder['asset_id'] = filter.assetId.toString();
    }
    if (filter.assetTypeComparison) {
      queryBuilder['asset_type_comparison'] =
        filter.assetTypeComparison.toString();
    }
    if (filter.assetSymbol) {
      queryBuilder['asset_symbol'] = filter.assetSymbol.toString();
    }
    if (filter.assetSymbolComparison) {
      queryBuilder['asset_symbol_comparison'] =
        filter.assetSymbolComparison.toString();
    }
    if (filter.pageNumber) {
      queryBuilder['page_number'] = filter.pageNumber.toString();
    }
    if (filter.pageSize) {
      queryBuilder['page_size'] = filter.pageSize.toString();
    }
    if (filter.sortBy) {
      queryBuilder['sort_by'] = filter.sortBy.toString();
    }

    const query = new URLSearchParams(queryBuilder).toString();
    if (this.clientConfig.retryStrategyOn) {
      return await trySafeExecute<
        ResponseData<IGetAllEntitiesResponse<IAsset>>
      >(this.doGenericGetCall, [`${this.getProvider().url}/assets?${query}`]);
    } else {
      return await this.doGenericGetCall<IGetAllEntitiesResponse<IAsset>>(
        `${this.getProvider().url}/assets?${query}`,
      );
    }
  }
}
