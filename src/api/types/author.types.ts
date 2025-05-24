import { BookDTO } from './book.types';

export interface AuthorDTO {
  id?: number;
  name: string;
  nationality: string;
  biography?: string;
  birthDate?: string;
  books?: BookDTO[];
}

export interface AuthorCreateRequest {
  name: string;
  nationality: string;
  biography?: string;
  birthDate?: string;
}

export interface AuthorUpdateRequest extends AuthorCreateRequest {
  id: number;
}

export interface AuthorSearchParams {
  name: string;
}

export interface AuthorQueryFilters {
  nationality?: string;
  searchTerm?: string;
}
