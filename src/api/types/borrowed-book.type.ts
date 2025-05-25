import type { BookSummaryDTO } from './book.types';
import type { MemberDTO } from './member.types';

/**
 * Full BorrowedBook data as returned by the backend
 */
export interface BorrowedBookDTO {
  id: number;
  borrowDate: string; // ISO date string (YYYY-MM-DD)
  dueDate: string; // ISO date string
  returnDate?: string; // ISO date string
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
  fineAmount: number;
  notes?: string;
  createdAt?: string; // ISO datetime string
  updatedAt?: string; // ISO datetime string
  book: BookSummaryDTO;
  member: MemberDTO;
}

/**
 * Payload for creating a new borrowed-book record
 */
export interface BorrowedBookCreateRequest {
  bookId: number;
  memberId: number;
  borrowDate?: string; // ISO date string; defaults to today
  dueDate?: string; // ISO date string; defaults to borrowDate + 14 days
  notes?: string;
}

/**
 * Payload for updating an existing borrowed-book record
 */
export interface BorrowedBookUpdateRequest extends BorrowedBookCreateRequest {
  id: number;
  status?: 'BORROWED' | 'RETURNED' | 'OVERDUE';
  returnDate?: string; // ISO date string
  fineAmount?: number;
}

/**
 * Filters when querying borrowed-books list
 */
export interface BorrowedBookQueryFilters {
  memberId?: number;
  bookId?: number;
  status?: 'BORROWED' | 'RETURNED' | 'OVERDUE';
  fromDate?: string; // ISO date string
  toDate?: string; // ISO date string
}
