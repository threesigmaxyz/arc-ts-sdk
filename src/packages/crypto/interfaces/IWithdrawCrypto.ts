import { WithdrawDetailsDto } from '../../client/gen';

/**
 * Interface for IWithdrawClient object
 *
 * @see setBaseAccount - set base account for wallet
 * @see getBaseAccount - get base account for wallet
 */
export interface IWithdrawCrypto {
  /**
   * Withdraw funds onchain from a previous withdraw request
   *
   */
  withdrawOnChain(withdrawDetails: WithdrawDetailsDto): Promise<void>;
}
