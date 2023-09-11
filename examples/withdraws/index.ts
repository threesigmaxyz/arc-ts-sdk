/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv';
import { Client, IProvider, IStarkExpressAccount } from '../../src';
import { ClientFactory } from '../../src';
import { ResponseData } from '../../src';
import { WithdrawDetailsDto, WithdrawModel } from '../../src/gen';
import { ethers } from 'ethers';

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
  console.log(`${chalk.green.bold('StarkExpress Withdraw Client Example')}`);
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
    starkExpressClient.setJsonRpcProvider(new ethers.JsonRpcProvider());
    starkExpressClient.withdraws().setBaseAccount(starkExpressAccount);

    // withdraw asset
    const withdrawData: WithdrawModel = {
      vaultId: '6554d7c3-364e-4536-9cd7-bb0ce8f7c600',
      amount: '65350000',
    };

    const withdraw: ResponseData<WithdrawDetailsDto> = await starkExpressClient
      .withdraws()
      .withdraw(withdrawData);

    if (withdraw.error) {
      throw new Error(JSON.stringify(withdraw.error, null, 4));
    }

    console.log(
      `Withdraw details: ${JSON.stringify(withdraw.result, null, 4)}`,
    );

    // onchain withdraw
    await starkExpressClient.withdraws().withdrawOnChain(withdraw.result);

    process.exit(0);
  } catch (ex) {
    const msg = chalk.red(`Error = ${ex}`);
    console.error(msg);
    process.exit(-1);
  }
})();
