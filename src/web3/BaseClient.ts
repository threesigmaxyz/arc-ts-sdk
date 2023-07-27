import { IProvider } from '../interfaces/IProvider';
import { IClientConfig } from '../interfaces/IClientConfig';
import { JsonRpcResponseData } from '../interfaces/JsonRpcResponseData';
import axios, { AxiosResponse, AxiosRequestHeaders } from 'axios';
import { JSON_RPC_REQUEST_METHOD } from '../interfaces/JsonRpcMethods';

export const requestHeaders = {
  Accept:
    'application/json,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
} as AxiosRequestHeaders;

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
    this.sendJsonRPCRequest = this.sendJsonRPCRequest.bind(this);
    this.setProvider = this.setProvider.bind(this);
    this.promisifyJsonRpcCall = this.promisifyJsonRpcCall.bind(this);
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
   * Converts an API call to a promise that resolves as a JsonRpcResponseData
   *
   * @privateRemarks
   * If there is an error while sending the request, the function catches the error, the isError
   * property is set to true, the result property set to null, and the error property set to a
   * new Error object with a message indicating that there was an error.
   *
   * @param resource - The rpc method to call.
   * @param params - The parameters to pass to the rpc method.
   *
   * @returns A promise that resolves as a JsonRpcResponseData.
   */
  private async promisifyJsonRpcCall<T>(
    resource: JSON_RPC_REQUEST_METHOD,
    params: object,
  ): Promise<JsonRpcResponseData<T>> {
    let resp: AxiosResponse<JsonRpcResponseData<T>> = null;

    const body = {
      jsonrpc: '2.0',
      method: resource,
      params: params,
      id: 0,
    };

    try {
      resp = await axios.post(this.getProvider().url, body, requestHeaders);
    } catch (ex) {
      return {
        isError: true,
        result: null,
        error: new Error('JSON.parse error: ' + String(ex)),
      } as JsonRpcResponseData<T>;
    }

    const responseData: JsonRpcResponseData<T> = resp.data;

    if (responseData.error) {
      return {
        isError: true,
        result: null,
        error: new Error(responseData.error.message),
      } as JsonRpcResponseData<T>;
    }

    return {
      isError: false,
      result: responseData.result as T,
      error: null,
    } as JsonRpcResponseData<T>;
  }

  /**
   * Sends a post API request to the node.
   *
   * @param resource - The rpc method to call.
   * @param params - The parameters to pass to the rpc method.
   *
   * @throws An error if the rpc method returns an error.
   *
   * @returns A promise that resolves as the result of the rpc method.
   */
  protected async sendJsonRPCRequest<T>(
    resource: JSON_RPC_REQUEST_METHOD,
    params: object,
  ): Promise<T> {
    let resp: JsonRpcResponseData<T> = null;
    resp = await this.promisifyJsonRpcCall(resource, params);

    // in case of rpc error, rethrow the error.
    if (resp.error && resp.error) {
      throw resp.error;
    }

    return resp.result;
  }
}
