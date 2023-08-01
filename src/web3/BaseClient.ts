import { IProvider } from '../interfaces/IProvider';
import { IClientConfig } from '../interfaces/IClientConfig';
import { ResponseData } from '../interfaces/ResponseData';
import { IRequestError } from '../interfaces/IRequestError';
import axios, { AxiosRequestHeaders, AxiosResponse } from 'axios';

/**
 * The Base Client object is the main entry point for interacting with the StarkExpress L2 chain.
 *
 * @remarks
 * The `BaseClient` class should not be instantiated directly; instead, it should
 * be extended by other client classes to provide additional functionality on top of the core
 * methods provided by this class.
 *
 * @throws Will throw an error if no provider are included in client configuration.
 */
export class BaseClient {
  protected clientConfig: IClientConfig;

  /**
   * Constructor of the BaseClient class
   *
   * @param clientConfig - The client configuration object as defined in {@link IClientConfig}
   */
  public constructor(clientConfig: IClientConfig) {
    this.clientConfig = clientConfig;

    // bind class methods
    this.getProvider = this.getProvider.bind(this);
    this.setProvider = this.setProvider.bind(this);
    this.doGenericPostCall = this.doGenericPostCall.bind(this);
    this.doGenericGetCall = this.doGenericGetCall.bind(this);
  }

  /**
   * Set new providers as {@link IProvider}.
   *
   * @privateRemarks
   * This methods adds a provider
   *
   * @param provider - The new provider to set of type IProvider
   *
   * @throws Will throw an error if no provider is included.
   */
  public setProvider(provider: IProvider): void {
    this.clientConfig.provider = provider;
  }

  /**
   * Returns the provider.
   *
   * @returns An object of IProvider.
   */
  protected getProvider(): IProvider {
    return this.clientConfig.provider;
  }

  /**
   * Creates a generic post call using axios which returns `Promise<ResponseData<T>>`
   *
   *
   * @param url - The http url to call.
   * @param body - The message body to send.
   *
   * @returns A promise that resolves as a `Promise<ResponseData<T>>`.
   */
  protected async doGenericPostCall<T>(
    url: string,
    body?: object,
  ): Promise<ResponseData<T>> {
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${this.clientConfig.apiKey}`,
    } as AxiosRequestHeaders;

    let resp: AxiosResponse<T, any> = null;

    try {
      resp = await axios({
        method: 'post',
        url,
        data: body || {},
        headers: headers,
      });
    } catch (error) {
      if (error.response) {
        // The server responded with a status other than 2xx (e.g., 4xx, 5xx)
        return { error: error.response.data as IRequestError };
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error:', error.message);
      }
    }

    return { result: resp.data as T };
  }

  /**
   * Creates a generic get call using axios which returns `Promise<ResponseData<T>>`
   *
   *
   * @param url - The http url to call.
   * @param body - The message body to send.
   *
   * @returns A promise that resolves as a `Promise<ResponseData<T>>`.
   */
  protected async doGenericGetCall<T>(url: string): Promise<ResponseData<T>> {
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${this.clientConfig.apiKey}`,
    } as AxiosRequestHeaders;

    let resp: AxiosResponse<T, any> = null;

    try {
      resp = await axios({
        method: 'get',
        url,
        headers: headers,
      });
    } catch (error) {
      if (error.response) {
        // The server responded with a status other than 2xx (e.g., 4xx, 5xx)
        return { error: error.response.data as IRequestError };
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error:', error.message);
      }
    }

    return { result: resp.data as T };
  }
}
