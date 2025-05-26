import type { AxiosResponse, AxiosError } from 'axios';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';

import { API_ENDPOINTS, QUERY_KEYS } from 'src/constants/api.constants';
import apiClient from '../axiosConfig';

import type { ApiResponseDTO } from '../types/api-response.types';
import {
  BorrowedBookCreateRequest,
  BorrowedBookDTO,
  BorrowedBookQueryFilters,
  BorrowedBookUpdateRequest,
} from '../types/borrowed-book.type';

// Base URL for the API
const API_BASE_URL = API_ENDPOINTS.BORROWED_BOOKS;

// API Response Types
type BorrowedBooksResponse = ApiResponseDTO<BorrowedBookDTO>;
type BorrowedBooksListResponse = ApiResponseDTO<BorrowedBookDTO[]>;

// Borrowing Statistics DTO
interface BorrowingStatsDTO {
  totalBorrowings: number;
  currentlyBorrowed: number;
  overdueBooks: number;
  returnedBooks: number;
  totalFinesCollected: number;
}

// API Error Type
interface ApiError extends AxiosError {
  response?: AxiosResponse<ApiResponseDTO<null>>;
}

// API functions
export const borrowedBooksApi = {
  // Create/Borrow a book
  createBorrowedBooks: (memberData: BorrowedBookCreateRequest): Promise<BorrowedBooksResponse> =>
    apiClient
      .post<BorrowedBooksResponse>(`${API_BASE_URL}/borrow`, memberData)
      .then((res) => res.data),

  // Get all borrowed books with pagination
  getAllBorrowedBooks: (page = 0, size = 50): Promise<BorrowedBooksListResponse> =>
    apiClient
      .get<BorrowedBooksListResponse>(`${API_BASE_URL}?page=${page}&size=${size}`)
      .then((res) => res.data),

  // Get borrowed book by ID
  getBorrowedBookById: (id: number): Promise<BorrowedBooksResponse> =>
    apiClient.get<BorrowedBooksResponse>(`${API_BASE_URL}/${id}`).then((res) => res.data),

  // Update borrowed book
  updateBorrowedBook: (
    id: number,
    data: BorrowedBookUpdateRequest
  ): Promise<BorrowedBooksResponse> =>
    apiClient.put<BorrowedBooksResponse>(`${API_BASE_URL}/${id}`, data).then((res) => res.data),

  // Delete borrowed book
  deleteBorrowedBook: (id: number): Promise<ApiResponseDTO<void>> =>
    apiClient.delete<ApiResponseDTO<void>>(`${API_BASE_URL}/${id}`).then((res) => res.data),
};

// Query Keys
export const borrowedBooksKeys = {
  all: [QUERY_KEYS.BORROWED_BOOKS] as const,
  lists: () => [...borrowedBooksKeys.all, 'list'] as const,
  list: (filters?: BorrowedBookQueryFilters) =>
    [...borrowedBooksKeys.lists(), { filters }] as const,
  details: () => [...borrowedBooksKeys.all, 'detail'] as const,
  detail: (id: number) => [...borrowedBooksKeys.details(), id] as const,
  member: (memberId: number) => [...borrowedBooksKeys.all, 'member', memberId] as const,
};

// =======================
// MUTATION HOOKS
// =======================

// Create/Borrow book
export const useCreateBorrowedBooks = (
  options: UseMutationOptions<BorrowedBooksResponse, ApiError, BorrowedBookCreateRequest> = {}
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: borrowedBooksApi.createBorrowedBooks,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: borrowedBooksKeys.lists() });
      if (data.data?.id) {
        queryClient.setQueryData(borrowedBooksKeys.detail(data.data.id), data);
      }
    },
    onError: (error) => console.error('Failed to create borrow book:', error),
    ...options,
  });
};

// Update borrowed book
export const useUpdateBorrowedBook = (
  options: UseMutationOptions<
    BorrowedBooksResponse,
    ApiError,
    { id: number; data: BorrowedBookUpdateRequest }
  > = {}
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => borrowedBooksApi.updateBorrowedBook(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: borrowedBooksKeys.lists() });
      queryClient.setQueryData(borrowedBooksKeys.detail(id), data);
    },
    onError: (error) => console.error('Failed to update borrowed book:', error),
    ...options,
  });
};

// Delete borrowed book
export const useDeleteBorrowedBook = (
  options: UseMutationOptions<ApiResponseDTO<void>, ApiError, number> = {}
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: borrowedBooksApi.deleteBorrowedBook,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: borrowedBooksKeys.lists() });
      queryClient.removeQueries({ queryKey: borrowedBooksKeys.detail(id) });
    },
    onError: (error) => console.error('Failed to delete borrowed book:', error),
    ...options,
  });
};

// =======================
// QUERY HOOKS
// =======================

// Get all borrowed books
export const useGetAllBorrowedBooks = (
  page = 0,
  size = 50,
  options?: Omit<UseQueryOptions<BorrowedBooksListResponse, ApiError>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    queryKey: borrowedBooksKeys.list({ page, size }),
    queryFn: () => borrowedBooksApi.getAllBorrowedBooks(page, size),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });

// Get borrowed book by ID
export const useGetBorrowedBookById = (
  id: number,
  options: Omit<UseQueryOptions<BorrowedBooksResponse, ApiError>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    queryKey: borrowedBooksKeys.detail(id),
    queryFn: () => borrowedBooksApi.getBorrowedBookById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
