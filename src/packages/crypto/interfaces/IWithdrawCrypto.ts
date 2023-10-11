import { WithdrawDetailsDto } from '../../client/gen';

/**
 * Interface for IWithdrawCrypto object
 *
 * @see withdrawOnChain - set base account for wallet
 */
export interface IWithdrawCrypto {
  /**
   * Withdraw funds onchain from a previous withdraw request
   *
   */
  withdrawOnChain(withdrawDetails: WithdrawDetailsDto): Promise<void>;
}
