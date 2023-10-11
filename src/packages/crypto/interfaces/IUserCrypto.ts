import { RegisterUserModel } from '../../client/gen';
import {
  MessageTypes,
  TypedMessage,
} from '@metamask/eth-sig-util/dist/sign-typed-data';

/**
 * Interface for IUserCrypto object
 *
 * @see signRegisterDetails() - registers a new Arc user
 */
export interface IUserCrypto {
  /**
   * Registers a new Arc user.
   *
   * @param username - Arc Username.
   * @param registerDetails - register details payload of type `TypedMessage<MessageTypes>`.
   *
   * @returns An object of type `IRegisteredUser`.
   */
  signRegisterDetails(
    username: string,
    registerDetails: TypedMessage<MessageTypes>,
  ): Promise<RegisterUserModel>;
}
