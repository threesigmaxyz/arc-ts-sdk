import { IStarkExpressAccount } from './IStarkExpressAccount';
import { ResponseData } from './ResponseData';
import { IDepositDetails } from './IDepositDetails';
import {
  BatchMintRequestModel,
  DepositDetailsModel,
  TransferDetailsModel,
  TransferModel,
} from '../gen';
import { IVault } from './IVault';
import { ITransferDetails } from './ITransferDetails';

/**
 * Interface for IOperationsClient object
 *
 * @see setBaseAccount - set base account for wallet
 * @see getBaseAccount - get base account for wallet
 * @see getDepositDetailsFotAsset - get deposit details for asset
 */
export interface IOperationsClient {
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
   * Configure Fee Model
   *
   * @param feeModelData - The fee model data to configure with
   *
   * @returns a promise that resolves to an object of `ResponseData<IFeeModel>`.
   */
  getDepositDetailsFotAsset(
    depositDetailsPayload: DepositDetailsModel,
  ): Promise<ResponseData<IDepositDetails>>;

  /**
   * Mint Assets in a batch
   *
   * @param mintRequest - The deposit details to be retrieved
   *
   * @returns a promise that resolves to an object of `ResponseData<{ [key: string]: Array<IVault> }>`.
   */
  mintAssets(
    mintRequest: BatchMintRequestModel,
  ): Promise<ResponseData<{ [key: string]: Array<IVault> }>>;

  /**
   * Transfer Assets
   *
   * @param mintRequest - The transfer details to be used
   *
   * @returns a promise that resolves to an object of `ResponseData<[IVault]>`.
   */
  transferAsset(
    transferData: TransferModel,
  ): Promise<ResponseData<Array<IVault>>>;

  /**
   * Get Transfer Details
   *
   * @param transferDetailsData - The transfer details to be used
   *
   * @returns a promise that resolves to an object of `ResponseData<ITransferDetails>`.
   */
  getTransferDetails(
    transferDetailsData: TransferDetailsModel,
  ): Promise<ResponseData<ITransferDetails>>;
}
