import { FilterOptions, StarkExOperation, TransactionStatus } from '../gen';

export interface IGetAllTransactionsFilter {
  transactionStatus?: TransactionStatus;
  transactionStatusComparison?: FilterOptions;
  starkexTxId?: number;
  starkexTxIdComparison?: FilterOptions;
  txType?: StarkExOperation;
  txTypeComparison?: FilterOptions;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
}
