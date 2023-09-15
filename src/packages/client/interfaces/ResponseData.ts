import { IRequestError } from './IRequestError';

/**
 * Interface for API response data.
 *
 * @see result - the result of the response (can be null)
 * @see error - the error of the response (can be null)
 */
export interface ResponseData<T> {
  result?: T;
  error?: IRequestError;
}
