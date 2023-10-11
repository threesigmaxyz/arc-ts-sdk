import { SignatureModel, TransferDetailsDto } from '../../client/gen';

/**
 * Interface for ITransferCrypto object
 *
 * @see signTransfer() - Transfer an asset to another user
 */
export interface ITransferCrypto {
  /**
   * Transfer an asset to another user
   *
   * @param transferData - The data for transferring an asset to another user
   *
   * @returns a promise that resolves to an object of type `SignatureModel`.
   */
  signTransfer(transferData: TransferDetailsDto): SignatureModel;
}
