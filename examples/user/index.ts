/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv';
import { Client } from '../../src/packages/client';
import { IRegisteredUser } from '../../src/packages/client';
import { IUserInfo } from '../../src/packages/client';
import { IGetAllEntitiesResponse } from '../../src/packages/client';
import { ResponseData } from '../../src/packages/client';
import { FilterOptions } from '../../src/packages/client';
import {
  MessageTypes,
  TypedMessage,
} from '@metamask/eth-sig-util/dist/sign-typed-data';
import path from 'path';
import chalk from 'chalk';
import { ClientFactory, DefaultProviderUrls } from '../../src/packages/client';
import { IGetAllUsersFilter } from '../../src/packages/client';
import { CryptoUtils, ICryptoUtils } from 'arc-crypto-utils';

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
  console.log(`${chalk.green.bold('StarkExpress User Client Example')}`);
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

    // get register details
    const registerDetails = (await arcClient.user().getEIP712SignableData({
      username: 'evgenip',
      starkKey: cryptoUtils.starkAccount.publicKey,
      address: cryptoUtils.signer.address,
    })) as TypedMessage<MessageTypes>;

    // get signed register details
    const registerModel = await cryptoUtils
      .user()
      .signRegisterDetails('evgenip', registerDetails);

    // register a new user
    const registeredUser: ResponseData<IRegisteredUser> = await arcClient
      .user()
      .registerNewUser(registerModel);

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
    const userInfo: ResponseData<IUserInfo> = await arcClient
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
      await arcClient.user().getAllUsersInfo({
        username: 'evgenipirianov',
        usernameComparison: FilterOptions.Contains,
        pageNumber: 1,
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
