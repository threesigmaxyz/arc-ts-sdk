import { DepositDetailsModel } from '../gen';
import { IDepositDetails } from './IDepositDetails';
import { ResponseData } from './ResponseData';

/**
 * Interface for IDepositClient object
 *
 * @see setBaseAccount() - set base user account.
 * @see getBaseAccount() - get base user account.
 * @see depositAssets() - deposit assets into Arc.
 */
export interface IDepositClient {
  /**
   *
   * @param depositData - The data for depositing assets
   *
   * @returns a promise that resolves to an object of `ResponseData<IDepositDetails>`.
   */
  getDepositDetails(
    depositData: DepositDetailsModel,
  ): Promise<ResponseData<IDepositDetails>>;
}
