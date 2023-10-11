import { SignatureModel } from '../../client/gen';
import { OrderDataDto } from '../dtos/OrderDataDto';

/**
 * Interface for ISettlementCrypto object
 *
 * @see signOrder() - sign order to use in a Settlement.
 */
export interface ISettlementCrypto {
  /**
   *
   * @param orderData - The data for submitting part of a Settlement on Arc
   *
   * @returns a signature to use in the Settlement order body as object of type `SignatureModel`.
   */
  signOrder(orderData: OrderDataDto): SignatureModel;
}
