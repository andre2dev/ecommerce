import IProduct from "./IProduct";

export default interface IProductSearchResponse {
    query: string;
    pageSize: number;
    currentPage: number;
    totalItems: number;
    totalPages: number;
    results: IProduct[];
}