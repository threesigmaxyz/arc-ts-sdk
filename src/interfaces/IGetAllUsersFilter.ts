import { ITEM_COMPARISON } from "./EItemComparison";

export interface IGetAllUsersFilter {
    username?: string;
    usernameComparison?: ITEM_COMPARISON;
    address?: string;
    creationDate?: string;
    creationDateComparison?: ITEM_COMPARISON;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
}