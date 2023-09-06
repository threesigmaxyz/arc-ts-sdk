/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv';
import { Client, IProvider } from '../../src';
import { ClientFactory } from '../../src';
import { ResponseData } from '../../src';
import {
  BatchMintRequestModel,
  DataAvailabilityModes,
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

(async () => {
  const header = '='.repeat(process.stdout.columns - 1);
  console.log(header);
  console.log(`${chalk.green.bold('StarkExpress Mint Client Example')}`);
  console.log(header);

  try {
    console.log('Api Key ', apiKey);

    // ===================================================================================
    // init stark express client
    const starkExpressClient: Client = await ClientFactory.createCustomClient(
      { url: 'https://localhost:57679' } as IProvider,
      apiKey,
    );

    // mint asset
    const mintData: BatchMintRequestModel = {
      users: [
        {
          userId: '5a35dbab-02ba-4ed4-b799-59daa263488b',
          mints: [
            {
              mintingBlob: '0x123abc',
              amount: '10000',
              dataAvailabilityMode: DataAvailabilityModes.ZkRollup,
              assetId: 'b4c77f66-a345-411b-81a7-47c79eacf219',
            },
          ],
        },
      ],
    };

    const mint: ResponseData<{ [p: string]: Array<VaultDto> }> =
      await starkExpressClient.mints().mintAssets(mintData);

    if (mint.error) {
      throw new Error(JSON.stringify(mint.error, null, 4));
    }

    console.log(`Mints vaults: ${JSON.stringify(mint.result, null, 4)}`);

    process.exit(0);
  } catch (ex) {
    const msg = chalk.red(`Error = ${ex}`);
    console.error(msg);
    process.exit(-1);
  }
})();
