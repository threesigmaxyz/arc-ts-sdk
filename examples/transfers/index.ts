/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv';
import {
  Client,
  ClientFactory,
  DataAvailabilityModes,
  DefaultProviderUrls,
  ResponseData,
  TransferDetailsDto,
  TransferDetailsModel,
  TransferModel,
} from '../../src/packages/client';
import { CryptoUtils, ICryptoUtils } from '../../src/packages/crypto';

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
    // init stark express client
    const arcClient: Client = await ClientFactory.createDefaultClient(
      DefaultProviderUrls.TESTNET,
      apiKey,
    );

    // init cryptoUtils
    const cryptoUtils: ICryptoUtils = new CryptoUtils();
    await cryptoUtils.init('some message');

    // transfer asset
    const transferData: TransferDetailsModel = {
      senderUserId: '5a35dbab-02ba-4ed4-b799-59daa263488b',
      receiverUserId: '5a35dbab-02ba-4ed4-b799-59daa263488c',
      assetId: 'ba072cae-a82d-4c9b-b663-1f98cc8c38d1',
      senderDataAvailabilityMode: DataAvailabilityModes.Validium,
      receiverDataAvailabilityMode: DataAvailabilityModes.Validium,
      amount: '214159265350000',
    };

    const transferDetailsDtoResponseData: ResponseData<TransferDetailsDto> =
      await arcClient.transfers().getTransferDetails(transferData);

    if (transferDetailsDtoResponseData.error) {
      throw new Error(
        JSON.stringify(transferDetailsDtoResponseData.error, null, 4),
      );
    }

    const transferDetailsDto = transferDetailsDtoResponseData.result;

    const signature = cryptoUtils.transfers().signTransfer(transferDetailsDto);

    const transferModel: TransferModel = {
      senderVaultId: transferDetailsDto.senderVaultId,
      receiverVaultId: transferDetailsDto.receiverVaultId,
      quantizedAmount: transferDetailsDto.quantizedAmount,
      expirationTimestamp: transferDetailsDto.expirationTimestamp,
      nonce: transferDetailsDto.nonce,
      signature: signature,
    };

    const transferResponseData = await arcClient
      .transfers()
      .transferAsset(transferModel);

    if (transferResponseData.error) {
      throw new Error(JSON.stringify(transferResponseData.error, null, 4));
    }

    console.log(
      `Arc Transfer result: ${JSON.stringify(
        transferResponseData.result,
        null,
        4,
      )}`,
    );

    process.exit(0);
  } catch (ex) {
    const msg = chalk.red(`Error = ${ex}`);
    console.error(msg);
    process.exit(-1);
  }
})();
