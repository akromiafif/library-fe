import { BorrowedBookDTO } from './borrowed-book.type';

/**
 * Full Member data as returned by the backend
 */
export interface MemberDTO {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  membershipDate?: string; // ISO datetime string
  membershipStatus?: string; // e.g. 'ACTIVE', 'SUSPENDED', etc.
  createdAt?: string; // ISO datetime string
  updatedAt?: string; // ISO datetime string
  borrowedBooks?: BorrowedBookDTO[];
}

/**
 * Payload for creating a new member
 */
export interface MemberCreateRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  membershipDate?: string; // ISO datetime string
  membershipStatus?: string; // e.g. 'ACTIVE', 'SUSPENDED', etc.
}

/**
 * Payload for updating an existing member
 */
export interface MemberUpdateRequest extends MemberCreateRequest {
  id: number;
}

/**
 * Parameters for searching members by term
 */
export interface MemberSearchParams {
  searchTerm: string;
}

/**
 * Filters when querying members list
 */
export interface MemberQueryFilters {
  searchTerm?: string;
  email?: string;
}
