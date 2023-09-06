import { TransferDetailsModel, VaultDto } from '../gen';
import { ResponseData } from './ResponseData';
import { IStarkExpressAccount } from './IStarkExpressAccount';

/**
 * Interface for ITransferClient object
 *
 * @see transferAsset - Transfer an asset to another user
 */
export interface ITransferClient {
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
   * Transfer an asset to another user
   *
   * @param transferData - The data for transferring an asset to another user
   *
   * @returns a promise that resolves to an object of `ResponseData<Array<VaultDto>>`.
   */
  transferAsset(
    transferData: TransferDetailsModel,
  ): Promise<ResponseData<Array<VaultDto>>>;
}
