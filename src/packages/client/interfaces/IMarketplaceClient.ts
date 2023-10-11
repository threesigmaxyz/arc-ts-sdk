import {
  BuyOrderDetailsModel,
  MarketplaceOrderDtoPaginatedResponseDto,
  OfferDto,
  OfferDtoPaginatedResponseDto,
  OfferStatus,
  OrderDetailsDto,
  RegisterBuyOrderModel,
  RegisterSellOfferModel,
  SellOfferDetailsModel,
} from '../gen';
import { ResponseData } from './ResponseData';

/**
 * Interface for IMarketplaceClient object
 *
 * @see getSellOfferDetails() - fetch details of sell offer to submit a new sell offer.
 * @see submitSellOffer() - submit a new sell offer.
 * @see deleteSellOffer() - delete existing sell offer.
 * @see listSellOffers() - list sell offers.
 * @see getBuyOrderDetails() - fetch details of buy order to submit a new buy order.
 * @see submitBuyOrder() - submit a new buy order.
 * @see listBuyOrders() - list buy orders.
 */
export interface IMarketplaceClient {
  /**
   * This endpoint returns the details for a sell offer in the public marketplace.
   * @param sellOfferDetailsModel - The sell offer details request.
   * @throws RequiredError
   */
  getSellOfferDetails(
    sellOfferDetailsModel: SellOfferDetailsModel,
  ): Promise<ResponseData<OrderDetailsDto>>;

  /**
   * This endpoint registers a sell offer in the public marketplace.
   * @param registerSellOfferModel - The sell offer registration request.
   * @throws RequiredError
   */
  submitSellOffer(
    registerSellOfferModel: RegisterSellOfferModel,
  ): Promise<ResponseData<OfferDto>>;

  /**
   * This endpoint deletes a sell offer in the public marketplace.
   * @param  offerId - The offer id.
   * @throws RequiredError
   */
  deleteSellOffer(offerId: string): Promise<ResponseData<OfferDto>>;

  /**
   * This endpoint returns a paginated list of sell offer in the public marketplace.
   * @param  productId - ID of the product
   * @param  offerStatus - Status of the offers
   * @param  userId - ID of the seller
   * @param  pageNumber - Page number
   * @param  pageSize - Page size
   * @param  sortBy - Sort by property
   * @throws RequiredError
   */
  listSellOffers(
    productId: string,
    offerStatus?: OfferStatus,
    userId?: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: string,
  ): Promise<ResponseData<OfferDtoPaginatedResponseDto>>;

  /**
   * This endpoint returns the details for a buy order in the public marketplace.
   * @param  buyOrderDetailsModel - The buy order details request.
   * @throws RequiredError
   */
  getBuyOrderDetails(
    buyOrderDetailsModel: BuyOrderDetailsModel,
  ): Promise<ResponseData<OrderDetailsDto>>;

  /**
   * This endpoint buys a product listed in the public marketplace.
   * @param registerBuyOrderModel - The buy order registration request.
   * @throws RequiredError
   */
  submitBuyOrder(
    registerBuyOrderModel: RegisterBuyOrderModel,
  ): Promise<ResponseData<OfferDto>>;

  /**
   * This endpoint returns a paginated list of buy orders in the public marketplace.
   * @param offerId - ID of the offer
   * @param pageNumber - Page number
   * @param pageSize - Page size
   * @param sortBy - Sort by property
   * @throws RequiredError
   */
  listBuyOrders(
    offerId: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: string,
  ): Promise<ResponseData<MarketplaceOrderDtoPaginatedResponseDto>>;
}
