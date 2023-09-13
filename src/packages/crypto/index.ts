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
export { ICryptoUtils } from '../crypto/interfaces/ICryptoUtils';
export { CryptoUtils } from '../crypto/clients/CryptoUtils';
export { IStarkAccount } from '../crypto/interfaces/IStarkAccount';
