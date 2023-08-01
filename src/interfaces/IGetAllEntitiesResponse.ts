import { IPagination } from './IPagination';

export interface IGetAllEntitiesResponse<T> {
  data: [T];
  pagination: IPagination;
  totalCount: number;
}
