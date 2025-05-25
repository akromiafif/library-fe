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
  authorId: number;
}

export interface BookQueryFilters {
  genre?: string;
  publicationYear?: number;
  authorId?: number;
}
