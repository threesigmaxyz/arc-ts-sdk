/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv';
import { ConfigureFeeModel, FeeAction } from '../../src/packages/client/gen';
import {
  Client,
  ClientFactory,
  DefaultProviderUrls,
  IFeeModel,
  ResponseData,
} from 'arc-client';
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
  console.log(`${chalk.green.bold('Arc Fees Client Example')}`);
  console.log(header);

  try {
    console.log('Api Key ', apiKey);

    // init stark express client
    const arcClient: Client = await ClientFactory.createDefaultClient(
      DefaultProviderUrls.TESTNET,
      apiKey,
    );

    // configure fee Model
    const configuredFeeModel: ResponseData<IFeeModel> = await arcClient
      .fees()
      .configureFeeModel({
        feeAction: FeeAction.Transfer,
        basisPoints: 100,
      } as ConfigureFeeModel);

    if (configuredFeeModel.error) {
      throw new Error(JSON.stringify(configuredFeeModel.error, null, 4));
    }

    console.log(
      `Set Fee Model Info: ${JSON.stringify(
        configuredFeeModel.result,
        null,
        4,
      )}`,
    );

    // get fee model
    const feeModel: ResponseData<IFeeModel> = await arcClient
      .fees()
      .getFeeModel(configuredFeeModel.result?.feeId as string);

    if (feeModel.error) {
      throw new Error(JSON.stringify(feeModel.error, null, 4));
    }

    console.log(
      `Arc Fee Model Info: ${JSON.stringify(feeModel.result, null, 4)}`,
    );

    process.exit(0);
  } catch (ex) {
    const msg = chalk.red(`Error = ${ex}`);
    console.error(msg);
    process.exit(-1);
  }
})();
