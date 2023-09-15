/** Polyfills */
import { Buffer } from 'buffer';
import EventEmitter from 'events';

declare global {
  interface Window {
    Buffer: typeof Buffer;
    EventEmitter: typeof EventEmitter;
  }
}

// Check if we are on browser
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  window.EventEmitter = EventEmitter;
}

// crypto
export { ICryptoUtils } from './interfaces/ICryptoUtils';
export { CryptoUtils } from './utils/CryptoUtils';
export { IStarkAccount } from './interfaces/IStarkAccount';
