import type { BookSummaryDTO } from './book.types';

/**
 * Full BorrowedBook data as returned by the backend
 */
export interface BorrowedBookDTO {
  id?: number;
  bookId: number;
  memberId: number;
  bookTitle?: string;
  authorName?: string;
  memberName?: string;
  memberEmail?: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: BorrowStatus;
  fineAmount: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type BorrowStatus = 'BORROWED' | 'RETURNED' | 'OVERDUE' | 'LOST';

/**
 * Payload for creating a new borrowed-book record
 */
export interface BorrowedBookCreateRequest {
  bookId: number;
  memberId: number | '';
  borrowDate?: string; // ISO date string; defaults to today
  dueDate?: string; // ISO date string; defaults to borrowDate + 14 days
  notes?: string;
}

/**
 * Payload for updating an existing borrowed-book record
 */
export interface BorrowedBookUpdateRequest extends BorrowedBookCreateRequest {
  id: number;
  status?: 'BORROWED' | 'RETURNED' | 'OVERDUE' | 'LOST';
  returnDate?: string; // ISO date string
  fineAmount?: number;
}

/**
 * Filters when querying borrowed-books list
 */
export interface BorrowedBookQueryFilters {
  memberId?: number;
  bookId?: number;
  status?: 'BORROWED' | 'RETURNED' | 'OVERDUE' | 'LOST';
  fromDate?: string; // ISO date string
  toDate?: string; // ISO date string
  page?: number;
  size?: number;
}

/**
 * Advanced search request DTO for borrowed books
 * Used in POST /api/borrowed-books/search endpoint
 */
export interface SearchRequestDTO {
  // Book-related search criteria
  bookTitle?: string;
  bookAuthor?: string;
  bookIsbn?: string;
  bookId?: number;

  // Member-related search criteria
  memberName?: string;
  memberId?: number;
  memberEmail?: string;

  // Borrowing-related search criteria
  status?: 'BORROWED' | 'RETURNED' | 'OVERDUE' | 'LOST';
  borrowDateFrom?: string; // ISO date string
  borrowDateTo?: string; // ISO date string
  dueDateFrom?: string; // ISO date string
  dueDateTo?: string; // ISO date string
  returnDateFrom?: string; // ISO date string
  returnDateTo?: string; // ISO date string

  // Fine-related criteria
  minFineAmount?: number;
  maxFineAmount?: number;
  hasFines?: boolean; // true to find records with fines > 0

  // General search
  notes?: string; // Search in notes field

  // Pagination and sorting
  page?: number;
  size?: number;
  sortBy?: string; // e.g., 'borrowDate', 'dueDate', 'memberName', 'bookTitle'
  sortDirection?: 'ASC' | 'DESC';

  // Special filters
  overdue?: boolean; // true to find only overdue books
  dueWithinDays?: number; // find books due within X days
}
