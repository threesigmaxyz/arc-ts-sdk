import { DepositDetailsModel } from '../gen';
import { IDepositDetails } from './IDepositDetails';
import { ResponseData } from './ResponseData';
import { IStarkExpressAccount } from './IStarkExpressAccount';

/**
 * Interface for IDepositClient object
 *
 * @see setBaseAccount() - set base user account.
 * @see getBaseAccount() - get base user account.
 * @see depositAssets() - deposit assets into Arc.
 */
export interface IDepositClient {
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
   *
   * @param depositData - The data for depositing assets
   *
   * @returns a promise that resolves to an object of `ResponseData<IDepositDetails>`.
   */
  depositAssets(
    depositData: DepositDetailsModel,
  ): Promise<ResponseData<IDepositDetails>>;
}
