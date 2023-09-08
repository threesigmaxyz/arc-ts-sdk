import { IStarkExpressAccount } from './IStarkExpressAccount';
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
   * Get the base account.
   *
   * @returns The base account (or null if the base account is not set).
   */
  getBaseAccount(): IStarkExpressAccount | null;

  /**
   * Set the base account.
   *
   * @param baseAccount - The base account as an IStarkExpressAccount object.
   */
  setBaseAccount(baseAccount: IStarkExpressAccount): void;

  /**
   * Withdraw funds offchain from a specific vault
   *
   * @returns The withdrawDetails if the withdraw function was fully successful.
   */
  withdraw(
    withdrawModel: WithdrawModel,
  ): Promise<ResponseData<WithdrawDetailsDto>>;

  /**
   * Withdraw funds onchain from a previous withdraw request
   *
   */
  withdrawOnChain(withdrawDetails: WithdrawDetailsDto): Promise<void>;
}
