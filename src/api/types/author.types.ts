// src/types/author.types.ts
import type { BookSummaryDTO } from './book.types';

/**
 * Full Author data as returned by the backend
 */
export interface AuthorDTO {
  id: number;
  name: string;
  biography?: string;
  birthYear?: number;
  nationality: string;
  createdAt?: string; // ISO datetime string
  updatedAt?: string; // ISO datetime string
  books?: BookSummaryDTO[];
}

/**
 * Payload for creating a new author
 */
export interface AuthorCreateRequest {
  name: string;
  nationality: string;
  biography?: string;
  birthYear?: number;
  books?: any[];
}

/**
 * Payload for updating an existing author
 */
export interface AuthorUpdateRequest extends AuthorCreateRequest {
  id: number;
}

/**
 * Parameters for searching authors by name
 */
export interface AuthorSearchParams {
  name: string;
}

/**
 * Filters when querying authors list
 */
export interface AuthorQueryFilters {
  nationality?: string;
  searchTerm?: string;
}
