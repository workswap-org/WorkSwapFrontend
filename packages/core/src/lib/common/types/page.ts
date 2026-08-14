export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;          // текущая страница (0-based)
    size: number;
    first: boolean;
    last: boolean;
}