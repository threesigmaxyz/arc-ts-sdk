import { IStarkExpressAccount } from './IStarkExpressAccount';
import { ResponseData } from './ResponseData';
import { IGetDepositDetailsPayload } from './IGetDepositDetailsPayload';
import { IDepositDetails } from './IDepositDetails';

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
    depositDetailsPayload: IGetDepositDetailsPayload,
  ): Promise<ResponseData<IDepositDetails>>;
}
