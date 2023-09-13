/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv';
import { Client } from '../../src/web3/Client';
import { ClientFactory } from '../../src/web3/ClientFactory';
import { IStarkExpressAccount } from '../../src/interfaces/IStarkExpressAccount';
import { DataAvailabilityModes, DepositDetailsModel } from '../../src/gen';
import { ethers } from 'ethers';
import { IProvider } from '../../src';
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
const jsonRpcProviderUrl = process.env.JSONRPC_PROVIDER_URL;
if (!jsonRpcProviderUrl) {
  throw new Error('Missing JSONRPC_PROVIDER_URL in .env file');
}

(async () => {
  const header = '='.repeat(process.stdout.columns - 1);
  console.log(header);
  console.log(`${chalk.green.bold('Arc Deposit Client Example')}`);
  console.log(header);

  try {
    console.log('Ethereum Private Key ', ethereumPrivateKey);
    console.log('Api Key ', apiKey);
    console.log('JsonRpc provider url ', jsonRpcProviderUrl);

    // ===================================================================================
    // init arc client
    const starkExpressClient: Client = await ClientFactory.createCustomClient(
      { url: 'https://localhost:57679' } as IProvider,
      apiKey,
      new ethers.JsonRpcProvider(jsonRpcProviderUrl),
    );

    // generate a starkexpress account
    const starkExpressAccount: IStarkExpressAccount = starkExpressClient
      .user()
      .generateStarkAccount(ethereumPrivateKey);

    starkExpressClient.deposit().setBaseAccount(starkExpressAccount);

    // Execute deposit
    const depositResponse = await starkExpressClient.deposit().depositAssets({
      userId: '5a35dbab-02ba-4ed4-b799-59daa263488b',
      dataAvailabilityMode: DataAvailabilityModes.Validium,
      assetId: 'ba072cae-a82d-4c9b-b663-1f98cc8c38d1',
      amount: '10000',
    } as DepositDetailsModel);

    if (depositResponse.error) {
      throw new Error(JSON.stringify(depositResponse.error, null, 4));
    }

    console.log(
      `A deposit was made on Arc: ${JSON.stringify(
        depositResponse.result,
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
