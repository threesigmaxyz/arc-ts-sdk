import { FeeAction } from './FeeAction';

export interface IConfigureFeeModelPayload {
  feeAction: FeeAction;
  basisPoints: number;
}
