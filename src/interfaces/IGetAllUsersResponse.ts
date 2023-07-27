import { IPagination } from './IPagination';
import { IRegisteredUser } from './IRegisteredUser';

export interface IGetAllUsersResponse {
  data: [IRegisteredUser];
  pagination: IPagination;
  totalCount: number;
}
