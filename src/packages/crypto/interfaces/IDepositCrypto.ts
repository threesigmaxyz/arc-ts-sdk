import { DepositDetailsDto } from '../../client/gen';

/**
 * Interface for IDepositClient object
 *
 * @see deposit() - deposit assets into Arc.
 */
export interface IDepositCrypto {
  /**
   *
   * @param depositData - The data for depositing assets, that can be fetch through the aux endpoints on Arc
   *
   * @returns a promise that resolves to an object of `ResponseData<IDepositDetails>`.
   */
  deposit(depositData: DepositDetailsDto): Promise<void>;
}
