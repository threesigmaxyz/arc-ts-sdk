/* eslint-disable @typescript-eslint/no-var-requires */
import { Client, ClientFactory, DefaultProviderUrls } from 'arc-client';
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
  console.log(`${chalk.green.bold('Arc Assets Client Example')}`);
  console.log(header);

  try {
    console.log('Api Key ', apiKey);

    // init stark express client
    const arcClient: Client = await ClientFactory.createDefaultClient(
      DefaultProviderUrls.TESTNET,
      apiKey,
    );
    const healthStatus = await arcClient.health();
    console.log('Got health status: ', healthStatus);

    process.exit(0);
  } catch (ex) {
    const msg = chalk.red(`Error = ${ex}`);
    console.error(msg);
    process.exit(-1);
  }
})();
