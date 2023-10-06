/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Client,
  ClientFactory,
  DataAvailabilityModes,
  DefaultProviderUrls,
  DepositDetailsModel,
} from 'arc-client';
import { CryptoUtils, ICryptoUtils } from 'arc-crypto-utils';
import * as dotenv from 'dotenv';
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
  console.log(`${chalk.green.bold('Arc Deposit Client Example')}`);
  console.log(header);

  try {
    console.log('Api Key ', apiKey);

    // ===================================================================================
    // init arc client
    const arcClient: Client = await ClientFactory.createDefaultClient(
      DefaultProviderUrls.TESTNET,
      apiKey,
    );

    // init cryptoUtils
    const cryptoUtils: ICryptoUtils = new CryptoUtils();
    await cryptoUtils.init('some message');

    // Get deposit details
    const depositDetailsModel: DepositDetailsModel = {
      userId: '5a35dbab-02ba-4ed4-b799-59daa263488b',
      dataAvailabilityMode: DataAvailabilityModes.Validium,
      assetId: 'ba072cae-a82d-4c9b-b663-1f98cc8c38d1',
      amount: '10000',
    };

    const depositDetails = await arcClient
      .deposit()
      .getDepositDetails(depositDetailsModel);

    if (depositDetails.error) {
      throw new Error(JSON.stringify(depositDetails.error, null, 4));
    }

    // Execute deposit
    await cryptoUtils.deposits().deposit(depositDetails.result);

    console.log(
      `A deposit was made on Arc: ${JSON.stringify(
        depositDetails.result,
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
