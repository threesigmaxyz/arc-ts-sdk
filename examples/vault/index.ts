/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv';
import { Client } from '../../src/web3/Client';
import {
  ClientFactory,
  DefaultProviderUrls,
} from '../../src/web3/ClientFactory';
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
  console.log(`${chalk.green.bold('StarkExpress Vault Client Example')}`);
  console.log(header);

  try {
    console.log('Api Key ', apiKey);

    // init stark express client
    const _starkExpressClient: Client = await ClientFactory.createDefaultClient(
      DefaultProviderUrls.TESTNET,
      apiKey,
    );
    console.log(_starkExpressClient);

    process.exit(0);
  } catch (ex) {
    const msg = chalk.red(`Error = ${ex}`);
    console.error(msg);
    process.exit(-1);
  }
})();