import { IStarkExpressAccount } from './IStarkExpressAccount';
import { IGetAllEntitiesResponse } from './IGetAllEntitiesResponse';
import { ResponseData } from './ResponseData';
import { IAsset } from './IAsset';
import { DeployAssetModel, EnableAssetModel, TenantAssetDto } from '../gen';
import { IGetAllAssetsFilter } from './IGetAllAssetsFilter';

/**
 * Interface for IAssetsClient object
 *
 * @see setBaseAccount - set base account for wallet
 * @see getBaseAccount - get base account for wallet
 * @see getAllAssetsInfo - get all assets info with a filter
 * @see getAsset - get a given asset info by assetId
 */
export interface IAssetsClient {
  /**
   * Set the base account.
   *
   * @param baseAccount - The base account as an IStarkExpressAccount object.
   */
  setBaseAccount(baseAccount: IStarkExpressAccount): void;

  /**
   * Get the base account.
   *
   * @returns The base account (or null if the base account is not set).
   */
  getBaseAccount(): IStarkExpressAccount | null;

  /**
   * Deploy Asset.
   *
   * @param assetData - The asset data to deploy the asset with
   *
   * @returns a promise that resolves to an object of `ResponseData<IAsset>`.
   */
  deployAsset(assetData: DeployAssetModel): Promise<ResponseData<IAsset>>;

  /**
   * Enable Asset by assetId.
   *
   * @param enableAssetData - The assetId data to be enabled
   *
   * @returns a promise that resolves to an object of IAsset.
   */
  enableAsset(enableAssetData: EnableAssetModel): Promise<ResponseData<IAsset>>;

  /**
   * Gets asset information.
   *
   * @param assetId - StarkExpress asset id.
   *
   * @returns An object of type IAsset.
   */
  getAsset(assetId: string): Promise<ResponseData<TenantAssetDto>>;

  /**
   * Gets multiple assets information.
   *
   * @param filter - IGetAllUsersFilter.
   *
   * @returns An object of type IGetAllUsersResponse.
   */
  getAllAssetsInfo(
    filter: IGetAllAssetsFilter,
  ): Promise<ResponseData<IGetAllEntitiesResponse<IAsset>>>;
}
