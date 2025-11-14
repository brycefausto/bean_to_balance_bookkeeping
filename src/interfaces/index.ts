export interface PaginatedData<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
}
