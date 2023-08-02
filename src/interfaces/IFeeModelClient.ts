import { IStarkExpressAccount } from './IStarkExpressAccount';
import { ResponseData } from './ResponseData';
import { IFeeModel } from './IFeeModel';
import { ConfigureFeeModel } from '../gen';

/**
 * Interface for IFeeModelClient object
 *
 * @see setBaseAccount - set base account for wallet
 * @see getBaseAccount - get base account for wallet
 * @see getFeeModel - get a feel model
 * @see configureFeeModel - configure fee model
 */
export interface IFeeModelClient {
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
   * Get Fee Model Info by feeId.
   *
   * @param feeId - The feeId to get the fee model for
   *
   * @returns a promise that resolves to an object of IFeeModel.
   */
  getFeeModel(feeId: string): Promise<ResponseData<IFeeModel>>;

  /**
   * Configure Fee Model
   *
   * @param feeModelData - The fee model data to configure with
   *
   * @returns a promise that resolves to an object of `ResponseData<IFeeModel>`.
   */
  configureFeeModel(
    feeModelData: ConfigureFeeModel,
  ): Promise<ResponseData<IFeeModel>>;
}
