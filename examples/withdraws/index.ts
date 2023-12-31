/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv';
import { Client, DefaultProviderUrls } from '../../src/packages/client';
import { ClientFactory } from '../../src/packages/client';
import { ResponseData } from '../../src/packages/client';
import { WithdrawDetailsDto, WithdrawModel } from '../../src/packages/client';
import { CryptoUtils, ICryptoUtils } from '../../src/packages/crypto';

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
  console.log(`${chalk.green.bold('Arc Withdraw Client Example')}`);
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

    // withdraw asset
    const withdrawData: WithdrawModel = {
      vaultId: '6554d7c3-364e-4536-9cd7-bb0ce8f7c600',
      amount: '65350000',
    };

    const withdraw: ResponseData<WithdrawDetailsDto> = await arcClient
      .withdraws()
      .withdraw(withdrawData);

    if (withdraw.error) {
      throw new Error(JSON.stringify(withdraw.error, null, 4));
    }

    console.log(
      `Withdraw details: ${JSON.stringify(withdraw.result, null, 4)}`,
    );

    // onchain withdraw
    await cryptoUtils
      .withdraws()
      .withdrawOnChain(withdraw.result as WithdrawDetailsDto);

    process.exit(0);
  } catch (ex) {
    const msg = chalk.red(`Error = ${ex}`);
    console.error(msg);
    process.exit(-1);
  }
})();
