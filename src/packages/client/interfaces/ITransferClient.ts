import {
  TransferDetailsDto,
  TransferDetailsModel,
  TransferModel,
  VaultDto,
} from '../gen';
import { ResponseData } from './ResponseData';

/**
 * Interface for ITransferClient object
 *
 * @see transferAsset - Transfer an asset to another user
 */
export interface ITransferClient {
  getTransferDetails(
    transferDetailsModel: TransferDetailsModel,
  ): Promise<ResponseData<TransferDetailsDto>>;

  /**
   * Transfer an asset to another user
   *
   * @param transferData - The data for transferring an asset to another user
   *
   * @returns a promise that resolves to an object of `ResponseData<Array<VaultDto>>`.
   */
  transferAsset(
    transferModel: TransferModel,
  ): Promise<ResponseData<Array<VaultDto>>>;
}
