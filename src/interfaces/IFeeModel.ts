import { FeeAction } from './FeeAction';

/**
 * Represents a fee model.
 *
 */
export interface IFeeModel {
  feeId: string;
  action: FeeAction;
  basisPoints: number;
}
