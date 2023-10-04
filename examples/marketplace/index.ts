/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv';
import { CryptoUtils, ICryptoUtils } from '../../src/packages/crypto';
import {
  Client,
  ClientFactory,
  DataAvailabilityModes,
  IProvider,
} from '../../src/packages/client';
import {
  BuyOrderDetailsModel,
  RegisterBuyOrderModel,
  RegisterSellOfferModel,
  SellOfferDetailsModel,
} from '../../src/packages/client/gen';

const path = require('path');
const chalk = require('chalk');

dotenv.config({
  path: path.resolve(__dirname, '..', '.env'),
});

const apiKey = process.env.X_API_KEY;
if (!apiKey) {
  throw new Error('Missing X_API_KEY in .env file');
}

(async () => {
  const header = '='.repeat(process.stdout.columns - 1);
  console.log(header);
  console.log(`${chalk.green.bold('Arc Transfer Client Example')}`);
  console.log(header);

  try {
    console.log('Api Key ', apiKey);

    // ===================================================================================
    // init arc client
    const arcClient: Client = await ClientFactory.createCustomClient(
      { url: 'https://localhost:57679' } as IProvider,
      apiKey,
    );

    // init cryptoUtils
    const cryptoUtils: ICryptoUtils = new CryptoUtils();
    await cryptoUtils.init('some message');

    // Get sell offer details
    const sellOfferDetails: SellOfferDetailsModel = {
      sellerId: '5a35dbab-02ba-4ed4-b799-59daa263488b',
      assetId: '5a35dbab-02ba-4ed4-b799-59daa263488c',
      quantity: '1',
      tokenId: '0xdeadbeef',
      currencyId: '5a35dbab-02ba-4ed4-b799-59daa263488d',
      dataAvailabilityMode: DataAvailabilityModes.Validium,
      price: '10000',
    };

    const sellOfferDetailsResponse = await arcClient
      .marketplace()
      .getSellOfferDetails(sellOfferDetails);

    if (sellOfferDetailsResponse.error) {
      throw new Error(JSON.stringify(sellOfferDetailsResponse.error, null, 4));
    }

    // Sign order data
    const sellOrderData = sellOfferDetailsResponse.result;
    const sellerSignature = cryptoUtils.marketplace().signOrder(sellOrderData);

    // Submit sell offer
    const sellOffer: RegisterSellOfferModel = {
      sellerId: '5a35dbab-02ba-4ed4-b799-59daa263488b',
      productVaultId: '5a35dbab-02ba-4ed4-b799-59daa263488c',
      productAmount: '1',
      currencyVaultId: '5a35dbab-02ba-4ed4-b799-59daa263488d',
      currencyAmount: '10000',
      expirationTimestamp: 1231231,
      nonce: 123,
      productName: 'some name',
      productDescription: 'some description',
      signature: sellerSignature,
    };

    const sellOfferResponse = await arcClient
      .marketplace()
      .submitSellOffer(sellOffer);

    if (sellOfferResponse.error) {
      throw new Error(JSON.stringify(sellOfferResponse.error, null, 4));
    }

    const offerDto = sellOfferResponse.result;

    // Fetch buy order details
    const buyOrderDetails: BuyOrderDetailsModel = {
      buyerId: '5a35dbab-02ba-4ed4-b799-59daa263488f',
      offerId: offerDto.offerId,
      dataAvailabilityMode: DataAvailabilityModes.Validium,
    };

    const buyOrderDetailsResponse = await arcClient
      .marketplace()
      .getBuyOrderDetails(buyOrderDetails);

    if (buyOrderDetailsResponse.error) {
      throw new Error(JSON.stringify(buyOrderDetailsResponse.error, null, 4));
    }

    // Sign buy order
    const buyOrderData = buyOrderDetailsResponse.result;
    const buyerSignature = cryptoUtils.marketplace().signOrder(buyOrderData);

    // Submit buy order
    const buyOrder: RegisterBuyOrderModel = {
      buyerId: '5a35dbab-02ba-4ed4-b799-59daa263488f',
      offerId: offerDto.offerId,
      productVaultId: buyOrderData.buyVaultId,
      currencyVaultId: buyOrderData.sellVaultChainId,
      expirationTimestamp: buyOrderData.expirationTimestamp,
      nonce: buyOrderData.nonce,
      signature: buyerSignature,
    };

    const buyOrderResponse = await arcClient
      .marketplace()
      .submitBuyOrder(buyOrder);

    if (buyOrderResponse.error) {
      throw new Error(JSON.stringify(buyOrderResponse.error, null, 4));
    }

    process.exit(0);
  } catch (ex) {
    const msg = chalk.red(`Error = ${ex}`);
    console.error(msg);
    process.exit(-1);
  }
})();
