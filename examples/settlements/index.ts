/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv';
import { CryptoUtils, ICryptoUtils } from '../../src/packages/crypto';
import { OrderDataDto } from '../../src/packages/crypto/dtos/OrderDataDto';

const path = require('path');
const chalk = require('chalk');

dotenv.config({
  path: path.resolve(__dirname, '..', '.env'),
});

(async () => {
  const header = '='.repeat(process.stdout.columns - 1);
  console.log(header);
  console.log(`${chalk.green.bold('Arc Transfer Client Example')}`);
  console.log(header);

  try {
    // ===================================================================================

    // init cryptoUtils
    const cryptoUtils: ICryptoUtils = new CryptoUtils();
    await cryptoUtils.init('some message');

    // order data
    const orderData: OrderDataDto = {
      sellQuantizedAmount: '21415926535',
      buyQuantizedAmount: '1',
      sellVaultChainId: 1,
      buyVaultChainId: 2,
      expirationTimestamp: 123123123,
      nonce: 123,
      assetBuy: '0x123abcafff',
      assetSell: '0x123abca123',
    };

    const signature = cryptoUtils.settlements().signOrder(orderData);

    console.log(`Arc signature result: ${JSON.stringify(signature, null, 4)}`);

    process.exit(0);
  } catch (ex) {
    const msg = chalk.red(`Error = ${ex}`);
    console.error(msg);
    process.exit(-1);
  }
})();
