import { JsonRpcProvider } from 'ethers';
import { IProvider } from './IProvider';

/**
 * This interface is used to configure the client.
 * @see apiKey of type `string` is the api key used for API requests.
 * @see provider of type `IProvider` is the provider used for API requests.
 * @see JsonRpcProvider of type `JsonRpcProvider` is the JsonRpcProvider used for interactions with the Ethereum blockchain.
 */
export interface IClientConfig {
  apiKey: string;
  provider: IProvider;
  jsonRpcProvider: JsonRpcProvider;
}
