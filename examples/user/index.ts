/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv';
import { Client } from '../../src/web3/Client';
import {
  ClientFactory,
  DefaultProviderUrls,
} from '../../src/web3/ClientFactory';
import { IRegisteredUser } from '../../src/interfaces/IRegisteredUser';
import { IStarkExpressAccount } from '../../src/interfaces/IStarkExpressAccount';
import { IUserInfo } from '../../src/interfaces/IUserInfo';
import { IGetAllUsersFilter } from '../../src/interfaces/IGetAllUsersFilter';
import { IGetAllEntitiesResponse } from '../../src/interfaces/IGetAllEntitiesResponse';
import { ResponseData } from '../../src/interfaces/ResponseData';
import { FilterOptions } from '../../src/gen';
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
  console.log(`${chalk.green.bold('StarkExpress User Client Example')}`);
  console.log(header);

  try {
    console.log('Ethereum Private Key ', ethereumPrivateKey);
    console.log('Api Key ', apiKey);

    // ===================================================================================
    // init stark express client
    const starkExpressClient: Client = await ClientFactory.createDefaultClient(
      DefaultProviderUrls.TESTNET,
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
    starkExpressClient.user().setBaseAccount(starkExpressAccount);

    // register a new user
    const registeredUser: ResponseData<IRegisteredUser> =
      await starkExpressClient
        .user()
        .registerStarkUser('evgenip', starkExpressAccount);

    if (registeredUser.error) {
      throw new Error(JSON.stringify(registeredUser.error, null, 4));
    }

    console.log(
      `StarkExpress Registered User: ${JSON.stringify(
        registeredUser.result,
        null,
        4,
      )}`,
    );

    // get user id
    const userInfo: ResponseData<IUserInfo> = await starkExpressClient
      .user()
      .getUserInfo('ff41bed6-4eb7-49c4-adf5-a0122230948c');

    if (userInfo.error) {
      throw new Error(JSON.stringify(userInfo.error, null, 4));
    }

    console.log(
      `StarkExpress User Info: ${JSON.stringify(userInfo.result, null, 4)}`,
    );

    // get all users with a filter
    const usersInfo: ResponseData<IGetAllEntitiesResponse<IRegisteredUser>> =
      await starkExpressClient.user().getAllUsersInfo({
        username: 'evgenipirianov',
        usernameComparison: FilterOptions.Contains,
        pageNumber: 0,
        pageSize: 100,
      } as IGetAllUsersFilter);

    if (userInfo.error) {
      throw new Error(JSON.stringify(usersInfo.error, null, 4));
    }

    console.log(
      `StarkExpress Users Info: ${JSON.stringify(usersInfo.result, null, 4)}`,
    );

    process.exit(0);
  } catch (ex) {
    const msg = chalk.red(`Error = ${ex}`);
    console.error(msg);
    process.exit(-1);
  }
})();
