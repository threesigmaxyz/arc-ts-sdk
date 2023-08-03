import { FilterOptions } from '../gen';

export interface IGetAllUsersFilter {
  username?: string;
  usernameComparison?: FilterOptions;
  address?: string;
  creationDate?: string;
  creationDateComparison?: FilterOptions;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
}
