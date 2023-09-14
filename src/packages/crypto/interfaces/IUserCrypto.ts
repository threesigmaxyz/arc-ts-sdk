import { RegisterUserModel } from '../../client/gen';
import {
  MessageTypes,
  TypedMessage,
} from '@metamask/eth-sig-util/dist/sign-typed-data';

/**
 * Interface for IUserClient object
 *
 * @see signRegisterDetails - get a given user info by userId
 */
export interface IUserCrypto {
  /**
   * Registers a new Arc user.
   *
   * @param username - Arc Username.
   * @param starkExpressAccount - starkExpress account of type IArcAccount.
   *
   * @returns An object of type IRegisteredUser.
   */
  signRegisterDetails(
    username: string,
    registerDetails: TypedMessage<MessageTypes>,
  ): Promise<RegisterUserModel>;
}