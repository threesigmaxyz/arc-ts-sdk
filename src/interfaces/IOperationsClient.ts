import { IStarkExpressAccount } from './IStarkExpressAccount';
import { ResponseData } from './ResponseData';
import { IDepositDetails } from './IDepositDetails';
import {
  BatchMintRequestModel,
  DepositDetailsModel,
  TransferDetailsModel,
  TransferModel,
  WithdrawModel,
} from '../gen';
import { IVault } from './IVault';
import { ITransferDetails } from './ITransferDetails';
import { ITransactionDetails } from './ITransactionDetails';
import { IGetAllTransactionsFilter } from './IGetAllTransactionsFilter';
import { IGetAllEntitiesResponse } from './IGetAllEntitiesResponse';
import { IWithdrawDetails } from './IWithdrawDetails';

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
  getDepositDetailsForAsset(
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

  /**
   * Get Transaction Details
   *
   * @param transactionId - The transaction Id
   *
   * @returns a promise that resolves to an object of `ResponseData<ITransactionDetails>`.
   */
  getTransaction(
    transactionId: string,
  ): Promise<ResponseData<ITransactionDetails>>;

  /**
   * Get All Transaction Details by Filter.
   *
   * @param filter - The filter used for filtering entries of type `IGetAllTransactionsFilter`
   *
   * @returns a promise that resolves to an object of `ResponseData<ITransactionDetails>`.
   */
  getAllTransactions(
    filter: IGetAllTransactionsFilter,
  ): Promise<ResponseData<IGetAllEntitiesResponse<ITransactionDetails>>>;

  /**
   * Withdraw Asset
   *
   * @param withdrawAssetData - The withdrawal details to be used
   *
   * @returns a promise that resolves to an object of `ResponseData<IWithdrawDetails>`.
   */
  withdrawAsset(
    withdrawAssetData: WithdrawModel,
  ): Promise<ResponseData<IWithdrawDetails>>;
}
