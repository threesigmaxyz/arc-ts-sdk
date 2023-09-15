import { ResponseData } from './ResponseData';
import { IVault } from './IVault';
import { IGetAllVaultsFilter } from './IGetAllVaultsFilter';
import { IGetAllEntitiesResponse } from './IGetAllEntitiesResponse';

/**
 * Interface for IVaultClient object
 *
 * @see getFeeModel - get a feel model
 * @see configureFeeModel - configure fee model
 */
export interface IVaultClient {
  /**
   * Get All Vaults by Filter.
   *
   * @param filter - The filter used for filtering entries of type `IGetAllVaultsFilter`
   *
   * @returns a promise that resolves to an object of `ResponseData<<IGetAllEntitiesResponse<IVault>>>`.
   */
  getAllVaults(
    filter: IGetAllVaultsFilter,
  ): Promise<ResponseData<IGetAllEntitiesResponse<IVault>>>;
}
