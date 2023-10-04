import { OrderDetailsDto, SignatureModel } from '../../client/gen';

/**
 * Interface for IMarketplaceCrypto object
 *
 * @see signOrder() - sign order to use in a Settlement.
 */
export interface IMarketplaceCrypto {
  /**
   *
   * @param orderDetailsDto - The data for submitting a offer or order on Arc's Marketplace
   *
   * @returns a signature to use in the offer/order body.
   */
  signOrder(orderDetailsDto: OrderDetailsDto): SignatureModel;
}
