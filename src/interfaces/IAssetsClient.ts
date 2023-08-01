import { IStarkExpressAccount } from './IStarkExpressAccount';
import { IGetAllUsersFilter } from './IGetAllUsersFilter';
import { IGetAllEntitiesResponse } from './IGetAllEntitiesResponse';
import { ResponseData } from './ResponseData';
import { IAsset } from './IAsset';

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
   * Gets asset information.
   *
   * @param assetId - StarkExpress asset id.
   *
   * @returns An object of type IAsset.
   */
  getAsset(assetId: string): Promise<ResponseData<IAsset>>;

  /**
   * Gets multiple assets information.
   *
   * @param filter - IGetAllUsersFilter.
   *
   * @returns An object of type IGetAllUsersResponse.
   */
  getAllAssetsInfo(
    filter: IGetAllUsersFilter,
  ): Promise<ResponseData<IGetAllEntitiesResponse<IAsset>>>;
}
