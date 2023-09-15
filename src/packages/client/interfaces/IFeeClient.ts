import { ResponseData } from './ResponseData';
import { IFeeModel } from './IFeeModel';
import { ConfigureFeeModel } from '../gen';

/**
 * Interface for IFeeClient object
 *
 * @see getFeeModel - get a feel model
 * @see configureFeeModel - configure fee model
 */
export interface IFeeClient {
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
