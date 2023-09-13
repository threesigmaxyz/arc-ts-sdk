/* eslint-disable @typescript-eslint/no-var-requires */
import { IClientConfig } from '../interfaces/IClientConfig';
import { BaseClient } from './BaseClient';
import {
  Configuration,
  WithdrawApi,
  WithdrawDetailsDto,
  WithdrawModel,
} from '../gen';
import { IWithdrawClient } from '../interfaces/IWithdrawClient';
import { ResponseData } from '../interfaces/ResponseData';
require('@starkware-industries/starkware-crypto-utils');
/**
 * A client class for interacting with the user API of StarkExpress.
 *
 * @remarks
 * The UserClient manages creating and registering new stark users as well as retrieving information on existing ones. It extends the BaseClient
 * class and implements the IUserClient interface.
 */
export class WithdrawClient extends BaseClient implements IWithdrawClient {
  private withdrawApi: WithdrawApi;

  /**
   * Constructor of the {@link WithdrawClient} class.
   *
   * @param clientConfig - Configuration parameters for the client.
   */
  public constructor(clientConfig: IClientConfig) {
    super(clientConfig);

    // bind generated client
    this.withdrawApi = new WithdrawApi({
      apiKey: clientConfig.apiKey,
      basePath: clientConfig.provider.url,
    } as Configuration);

    // bound methods
    this.withdraw = this.withdraw.bind(this);
  }

  /**
   * Executes the off-chain withdraw request
   *
   * @returns The withdraw details necessary to call the on-chain withdraw function after the ZK-Proof has ben posted on-chain.
   */
  public async withdraw(
    withdrawModel: WithdrawModel,
  ): Promise<ResponseData<WithdrawDetailsDto>> {
    const withdrawDetailsData = await this.getWithdrawDetails(withdrawModel);

    if (withdrawDetailsData.error) {
      throw new Error(JSON.stringify(withdrawDetailsData.error, null, 4));
    }

    return withdrawDetailsData;
  }

  private async getWithdrawDetails(
    withdrawModel: WithdrawModel,
  ): Promise<ResponseData<WithdrawDetailsDto>> {
    return await this.sanitizeResponse<WithdrawDetailsDto>(
      this.withdrawApi.withdraw(withdrawModel),
    );
  }
}
