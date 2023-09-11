/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv';
import { Client, IProvider } from '../../src';
import { ClientFactory } from '../../src';
import { IStarkExpressAccount } from '../../src';
import { ResponseData } from '../../src';
import {
  DataAvailabilityModes,
  TransferDetailsModel,
  VaultDto,
} from '../../src/gen';

const path = require('path');
const chalk = require('chalk');

dotenv.config({
  path: path.resolve(__dirname, '..', '.env'),
});

const apiKey = process.env.X_API_KEY;
if (!apiKey) {
  throw new Error('Missing X_API_KEY in .env file');
}
const ethereumPrivateKey = process.env.ETHEREUM_PRIVATE_KEY;
if (!ethereumPrivateKey) {
  throw new Error('Missing ETHEREUM_PRIVATE_KEY in .env file');
}

(async () => {
  const header = '='.repeat(process.stdout.columns - 1);
  console.log(header);
  console.log(`${chalk.green.bold('StarkExpress Transfer Client Example')}`);
  console.log(header);

  try {
    console.log('Ethereum Private Key ', ethereumPrivateKey);
    console.log('Api Key ', apiKey);

    // ===================================================================================
    // init stark express client
    const starkExpressClient: Client = await ClientFactory.createCustomClient(
      { url: 'https://localhost:57679' } as IProvider,
      apiKey,
    );
    // generate a starkexpress account
    const starkExpressAccount: IStarkExpressAccount = starkExpressClient
      .user()
      .generateStarkAccount(ethereumPrivateKey);

    console.log(
      `StarkExpress Account Generated: ${JSON.stringify(
        starkExpressAccount,
        null,
        4,
      )}`,
    );
    // set as base account
    starkExpressClient.transfers().setBaseAccount(starkExpressAccount);

    // transfer asset
    const transferData: TransferDetailsModel = {
      senderUserId: '5a35dbab-02ba-4ed4-b799-59daa263488b',
      receiverUserId: '5a35dbab-02ba-4ed4-b799-59daa263488c',
      assetId: 'ba072cae-a82d-4c9b-b663-1f98cc8c38d1',
      senderDataAvailabilityMode: DataAvailabilityModes.Validium,
      receiverDataAvailabilityMode: DataAvailabilityModes.Validium,
      amount: '214159265350000',
    };

    const transfer: ResponseData<Array<VaultDto>> = await starkExpressClient
      .transfers()
      .transferAsset(transferData);

    if (transfer.error) {
      throw new Error(JSON.stringify(transfer.error, null, 4));
    }

    console.log(`Transfer vaults: ${JSON.stringify(transfer.result, null, 4)}`);

    process.exit(0);
  } catch (ex) {
    const msg = chalk.red(`Error = ${ex}`);
    console.error(msg);
    process.exit(-1);
  }
})();
