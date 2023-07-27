import { IProvider } from './IProvider';

/**
 * This interface is used to configure the client.
 * @see apiKey of type `string` is the api key used for API requests.
 * @see provider of type `IProvider` is the provider used for API requests.
 * @see retryStrategyOn of type `boolean` (optional) is a flag to enable or disable the retry strategy.
 */
export interface IClientConfig {
  apiKey: string;
  provider: IProvider;
  retryStrategyOn?: boolean;
}
