import { IPagination } from './IPagination';

export interface IGetAllEntitiesResponse<T> {
  data?: [T] | null;
  pagination?: IPagination;
  totalCount?: number;
}
