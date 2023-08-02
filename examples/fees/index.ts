/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv';
import { Client } from '../../src/web3/Client';
import {
  ClientFactory,
  DefaultProviderUrls,
} from '../../src/web3/ClientFactory';
import { ResponseData } from '../../src/interfaces/ResponseData';
import { IConfigureFeeModelPayload } from '../../src/interfaces/IConfigureFeeModelPayload';
import { FeeAction } from '../../src/interfaces/FeeAction';
import { IFeeModel } from '../../src/interfaces/IFeeModel';
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
  console.log(`${chalk.green.bold('StarkExpress Fees Client Example')}`);
  console.log(header);

  try {
    console.log('Api Key ', apiKey);

    // init stark express client
    const starkExpressClient: Client = await ClientFactory.createDefaultClient(
      DefaultProviderUrls.TESTNET,
      apiKey,
      false,
    );

    // configure fee Model
    const configuredFeeModel: ResponseData<IFeeModel> = await starkExpressClient
      .fees()
      .configureFeeModel({
        feeAction: FeeAction.TRANSFER,
        basisPoints: 100,
      } as IConfigureFeeModelPayload);

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
    const feeModel: ResponseData<IFeeModel> = await starkExpressClient
      .fees()
      .getFeeModel(configuredFeeModel.result?.feeId as string);

    if (feeModel.error) {
      throw new Error(JSON.stringify(feeModel.error, null, 4));
    }

    console.log(
      `StarkExpress Fee Model Info: ${JSON.stringify(
        feeModel.result,
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
