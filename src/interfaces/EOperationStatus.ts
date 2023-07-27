/**
 * Represents the status of an operation on the StarkExpress's blockchain.
 */
export enum EOperationStatus {
  ADDED = 0,
  PENDING = 1,
  FINAL = 2,
  ERRORED = 3,
  NOT_FOUND = 4,
}
