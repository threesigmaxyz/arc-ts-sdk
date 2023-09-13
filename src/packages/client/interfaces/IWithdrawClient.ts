import { WithdrawDetailsDto, WithdrawModel } from '../gen';
import { ResponseData } from './ResponseData';

/**
 * Interface for IWithdrawClient object
 *
 * @see setBaseAccount - set base account for wallet
 * @see getBaseAccount - get base account for wallet
 */
export interface IWithdrawClient {
  /**
   * Withdraw funds offchain from a specific vault
   *
   * @returns The withdrawDetails if the withdraw function was fully successful.
   */
  withdraw(
    withdrawModel: WithdrawModel,
  ): Promise<ResponseData<WithdrawDetailsDto>>;
}
