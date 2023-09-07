import { BatchMintRequestModel, VaultDto } from '../gen';
import { ResponseData } from './ResponseData';

/**
 * Interface for IMintClient object
 *
 * @see mintAssets - Mint one or multiple assets for one or multiple users
 */
export interface IMintClient {
  /**
   * Mint one or multiple assets for one or multiple users
   *
   * @param mintData - The data for minting assets
   *
   * @returns a promise that resolves to an object of `ResponseData<{ [key: string]: Array<VaultDto> }>`.
   */
  mintAssets(
    mintData: BatchMintRequestModel,
  ): Promise<ResponseData<{ [key: string]: Array<VaultDto> }>>;
}
