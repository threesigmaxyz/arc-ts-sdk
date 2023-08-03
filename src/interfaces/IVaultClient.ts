import { IStarkExpressAccount } from './IStarkExpressAccount';
import { ResponseData } from './ResponseData';
import { AllocateVaultModel } from '../gen';
import { IVault } from './IVault';
import { IGetAllVaultsFilter } from './IGetAllVaultsFilter';
import { IGetAllEntitiesResponse } from './IGetAllEntitiesResponse';

/**
 * Interface for IVaultClient object
 *
 * @see setBaseAccount - set base account for wallet
 * @see getBaseAccount - get base account for wallet
 * @see getFeeModel - get a feel model
 * @see configureFeeModel - configure fee model
 */
export interface IVaultClient {
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
   * Allocate Vault
   *
   * @param vaultData - The data for allocating the vault
   *
   * @returns a promise that resolves to an object of `ResponseData<IVault>`.
   */
  allocateVault(vaultData: AllocateVaultModel): Promise<ResponseData<IVault>>;

  /**
   * Get Vault Info by Vault Id.
   *
   * @param vaultId - The vaultId to get the fee vault for
   *
   * @returns a promise that resolves to an object of `ResponseData<IVault>`.
   */
  getSingleVault(vaultId: string): Promise<ResponseData<IVault>>;

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
