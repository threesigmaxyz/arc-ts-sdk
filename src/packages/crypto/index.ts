/** Polyfills */
import { Buffer } from 'buffer';

// Check if we are on browser
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

// crypto
export { type ICryptoUtils } from './interfaces/ICryptoUtils';
export { CryptoUtils } from './utils/CryptoUtils';
export { type IStarkAccount } from './interfaces/IStarkAccount';
