import { IClientConfig } from '../interfaces/IClientConfig';
import { BaseClient } from './BaseClient';
import {
  Configuration,
  MarketplaceApi,
  OfferDto,
  BuyOrderDetailsModel,
  OrderDetailsDto,
  SellOfferDetailsModel,
  MarketplaceOrderDtoPaginatedResponseDto,
  OfferStatus,
  OfferDtoPaginatedResponseDto,
  RegisterBuyOrderModel,
  RegisterSellOfferModel,
} from '../gen';
import { ResponseData } from '../interfaces/ResponseData';
import { IMarketplaceClient } from '../interfaces/IMarketplaceClient';

/**
 * A client class for interacting with the Marketplace API of Arc.
 *
 * @remarks
 * The MarketplaceClient manages the marketplace offers and orders. It extends the BaseClient
 * class and implements the IMarketplaceClient interface.
 */
export class MarketplaceClient
  extends BaseClient
  implements IMarketplaceClient
{
  private marketplaceApi: MarketplaceApi;

  /**
   * Constructor of the {@link MarketplaceClient} class.
   *
   * @param clientConfig - Configuration parameters for the client.
   */
  public constructor(clientConfig: IClientConfig) {
    super(clientConfig);

    // bind generated client
    this.marketplaceApi = new MarketplaceApi({
      apiKey: clientConfig.apiKey,
      basePath: clientConfig.provider.url,
    } as Configuration);

    // bound methods
    this.deleteSellOffer = this.deleteSellOffer.bind(this);
    this.getBuyOrderDetails = this.getBuyOrderDetails.bind(this);
    this.getSellOfferDetails = this.getSellOfferDetails.bind(this);
    this.listBuyOrders = this.listBuyOrders.bind(this);
    this.listSellOffers = this.listSellOffers.bind(this);
    this.submitBuyOrder = this.submitBuyOrder.bind(this);
    this.submitSellOffer = this.submitSellOffer.bind(this);
  }

  public async deleteSellOffer(
    offerId: string,
  ): Promise<ResponseData<OfferDto>> {
    return await this.sanitizeResponse<OfferDto>(
      this.marketplaceApi.deleteSellOffer(offerId),
    );
  }

  public async getBuyOrderDetails(
    buyOrderDetailsModel: BuyOrderDetailsModel,
  ): Promise<ResponseData<OrderDetailsDto>> {
    return await this.sanitizeResponse<OrderDetailsDto>(
      this.marketplaceApi.buyOrderDetails(buyOrderDetailsModel),
    );
  }

  public async getSellOfferDetails(
    sellOfferDetailsModel: SellOfferDetailsModel,
  ): Promise<ResponseData<OrderDetailsDto>> {
    return await this.sanitizeResponse<OrderDetailsDto>(
      this.marketplaceApi.sellOfferDetails(sellOfferDetailsModel),
    );
  }

  public async listBuyOrders(
    offerId: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: string,
  ): Promise<ResponseData<MarketplaceOrderDtoPaginatedResponseDto>> {
    return await this.sanitizeResponse<MarketplaceOrderDtoPaginatedResponseDto>(
      this.marketplaceApi.listBuyOrders(offerId, pageNumber, pageSize, sortBy),
    );
  }

  public async listSellOffers(
    productId: string,
    offerStatus?: OfferStatus,
    userId?: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: string,
  ): Promise<ResponseData<OfferDtoPaginatedResponseDto>> {
    return await this.sanitizeResponse<OfferDtoPaginatedResponseDto>(
      this.marketplaceApi.listSellOffers(
        productId,
        offerStatus,
        userId,
        pageNumber,
        pageSize,
        sortBy,
      ),
    );
  }

  public async submitBuyOrder(
    registerBuyOrderModel: RegisterBuyOrderModel,
  ): Promise<ResponseData<OfferDto>> {
    return await this.sanitizeResponse<OfferDto>(
      this.marketplaceApi.registerBuyOrder(registerBuyOrderModel),
    );
  }

  public async submitSellOffer(
    registerSellOfferModel: RegisterSellOfferModel,
  ): Promise<ResponseData<OfferDto>> {
    return await this.sanitizeResponse<OfferDto>(
      this.marketplaceApi.registerSellOffer(registerSellOfferModel),
    );
  }
}
