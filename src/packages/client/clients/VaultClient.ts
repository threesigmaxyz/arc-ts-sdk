import { IClientConfig } from '../interfaces/IClientConfig';
import { BaseClient } from './BaseClient';
import { ResponseData } from '../interfaces/ResponseData';
import {
  AllocateVaultModel,
  Configuration,
  VaultApi,
  VaultDtoPaginatedResponseDto,
} from '../gen';
import { IVault } from '../interfaces/IVault';
import { IGetAllEntitiesResponse } from '../interfaces/IGetAllEntitiesResponse';
import { IGetAllVaultsFilter } from '../interfaces/IGetAllVaultsFilter';
import { AxiosResponse } from 'axios';
import { IVaultClient } from '../interfaces/IVaultClient';

/**
 * A client class for interacting with the vault API of Arc.
 *
 * @remarks
 * The VaultClient manages retrieving and setting fees. It extends the BaseClient
 * class and implements the IVaultClient interface.
 */
export class VaultClient extends BaseClient implements IVaultClient {
  private vaultApi: VaultApi;

  /**
   * Constructor of the {@link FeeClient} class.
   *
   * @param clientConfig - Configuration parameters for the client.
   */
  public constructor(clientConfig: IClientConfig) {
    super(clientConfig);

    // bind generated client
    this.vaultApi = new VaultApi({
      apiKey: clientConfig.apiKey,
      basePath: clientConfig.provider.url,
    } as Configuration);

    this.allocateVault = this.allocateVault.bind(this);
    this.getSingleVault = this.getSingleVault.bind(this);
  }

  /**
   * Allocate Vault
   *
   * @param vaultData - The data for allocating the vault
   *
   * @returns a promise that resolves to an object of `ResponseData<IVault>`.
   */
  public async allocateVault(
    vaultData: AllocateVaultModel,
  ): Promise<ResponseData<IVault>> {
    return await this.sanitizeResponse<IVault>(
      this.vaultApi.allocateVault(vaultData),
    );
  }

  /**
   * Get Vault Info by Vault Id.
   *
   * @param vaultId - The vaultId to get the fee vault for
   *
   * @returns a promise that resolves to an object of `ResponseData<IVault>`.
   */
  public async getSingleVault(vaultId: string): Promise<ResponseData<IVault>> {
    return await this.sanitizeResponse<IVault>(this.vaultApi.getVault(vaultId));
  }

  /**
   * Get All Vaults by Filter.
   *
   * @param filter - The filter used for filtering entries of type `IGetAllVaultsFilter`
   *
   * @returns a promise that resolves to an object of `ResponseData<<IGetAllEntitiesResponse<IVault>>>`.
   */
  public async getAllVaults(
    filter: IGetAllVaultsFilter,
  ): Promise<ResponseData<IGetAllEntitiesResponse<IVault>>> {
    const resp: Promise<
      AxiosResponse<VaultDtoPaginatedResponseDto, undefined>
    > = this.vaultApi.getAllVaults(
      filter.assetId,
      filter.pageNumber,
      filter.pageSize,
      filter.sortBy,
    );
    return (await this.sanitizeResponse<VaultDtoPaginatedResponseDto>(
      resp,
    )) as ResponseData<IGetAllEntitiesResponse<IVault>>;
  }
}
