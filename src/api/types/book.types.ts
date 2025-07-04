// src/types/book.types.ts

export interface BookSummaryDTO {
  id: number;
  title: string;
  category: string;
  publishingYear: number;
  availableCopies: number;
  totalCopies: number;
}

export interface BookDTO {
  id: number;
  title: string;
  category: string;
  publishingYear: number;
  isbn?: string;
  description?: string;
  totalCopies: number;
  availableCopies: number;
  authorId: number;
  authorName?: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface BookCreateRequest {
  title: string;
  category: string;
  publishingYear: number;
  isbn?: string;
  description?: string;
  totalCopies?: number;
  authorId?: number;
}

export interface BookQueryFilters {
  genre?: string;
  publicationYear?: number;
  authorId?: number;
}

/**
 * Payload for searching books.
 * Matches SearchRequestDTO on the backend.
 */
export interface SearchRequestDTO {
  title?: string;
  category?: string;
  publishingYear?: number;
  authorId?: number;
  availableOnly?: boolean;
}

export enum BorrowStatus {
  BORROWED = 'BORROWED',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE',
  LOST = 'LOST',
}
