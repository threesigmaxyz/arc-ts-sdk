/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv';
import { Client } from '../../src/web3/Client';
import { ClientFactory, DefaultProviderUrls } from '../../src/web3/ClientFactory';
import { IRegisteredUser } from '../../src/interfaces/IRegisteredUser';
import { IStarkExpressAccount } from '../../src/interfaces/IStarkExpressAccount';
import { IUserInfo } from '../../src/interfaces/IUserInfo';
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
  console.log(
    `${chalk.green.bold('StarkExpress User Client Example')}`,
  );
  console.log(header);

  try {
    console.log("Ethereum Private Key ", ethereumPrivateKey);
    console.log("Api Key ", apiKey);

    // init stark express client
    const starkExpressClient: Client = await ClientFactory.createDefaultClient(
      DefaultProviderUrls.TESTNET,
      apiKey,
    );
    // generate a starkexpress account
    const starkExpressAccount: IStarkExpressAccount = starkExpressClient.user().generateStarkAccount(ethereumPrivateKey);

    console.log(
      `StarkExpress Account Generated: ${
        JSON.stringify(starkExpressAccount, null, 4)
      }`,
    );
    // set as base account
    starkExpressClient.user().setBaseAccount(starkExpressAccount);

    // register a new user
    const registeredUser: IRegisteredUser = await starkExpressClient.user().registerStarkUser("evgenip", starkExpressAccount);
    console.log(
      `StarkExpress Registered User: ${
        JSON.stringify(registeredUser, null, 4)
      }`,
    );

    // get user id
    const userInfo: IUserInfo = await starkExpressClient.user().getUserInfo("ff41bed6-4eb7-49c4-adf5-a0122230948c");
    console.log(
      `StarkExpress User Info: ${
        JSON.stringify(userInfo, null, 4)
      }`,
    );

    process.exit(0);
  } catch (ex) {
    console.error(ex);
    const msg = chalk.red(`Error = ${ex}`);
    console.error(msg);
    process.exit(-1);
  }
})();
