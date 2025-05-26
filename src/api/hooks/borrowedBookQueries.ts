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
  SearchRequestDTO,
} from '../types/borrowed-book.type';

// Base URL for the API
const API_BASE_URL = API_ENDPOINTS.BORROWED_BOOKS;

// API Response Types
type BorrowedBooksResponse = ApiResponseDTO<BorrowedBookDTO>;
type BorrowedBooksListResponse = ApiResponseDTO<BorrowedBookDTO[]>;
type BorrowingStatsResponse = ApiResponseDTO<BorrowingStatsDTO>;
type MemberFinesResponse = ApiResponseDTO<number>;

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

// Status enum type based on your BorrowedBookDTO
type BorrowStatus = 'BORROWED' | 'RETURNED' | 'OVERDUE' | 'LOST';

// API functions
export const borrowedBooksApi = {
  // Create/Borrow a book
  createBorrowedBooks: (memberData: BorrowedBookCreateRequest): Promise<BorrowedBooksResponse> =>
    apiClient
      .post<BorrowedBooksResponse>(`${API_BASE_URL}/borrow`, memberData)
      .then((res) => res.data),

  // Return a book
  returnBook: (id: number): Promise<BorrowedBooksResponse> =>
    apiClient.put<BorrowedBooksResponse>(`${API_BASE_URL}/${id}/return`).then((res) => res.data),

  // Extend due date
  extendDueDate: (id: number, days: number): Promise<BorrowedBooksResponse> =>
    apiClient
      .put<BorrowedBooksResponse>(`${API_BASE_URL}/${id}/extend?days=${days}`)
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

  // Advanced search
  searchBorrowedBooks: (searchRequest: SearchRequestDTO): Promise<BorrowedBooksListResponse> =>
    apiClient
      .post<BorrowedBooksListResponse>(`${API_BASE_URL}/search`, searchRequest)
      .then((res) => res.data),

  // Quick search
  quickSearchBorrowedBooks: (query: string): Promise<BorrowedBooksListResponse> =>
    apiClient
      .get<BorrowedBooksListResponse>(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.data),

  // Get borrowed books by member
  getBorrowedBooksByMember: (memberId: number): Promise<BorrowedBooksListResponse> =>
    apiClient
      .get<BorrowedBooksListResponse>(`${API_BASE_URL}/member/${memberId}`)
      .then((res) => res.data),

  // Get current borrowings by member
  getCurrentBorrowingsByMember: (memberId: number): Promise<BorrowedBooksListResponse> =>
    apiClient
      .get<BorrowedBooksListResponse>(`${API_BASE_URL}/member/${memberId}/current`)
      .then((res) => res.data),

  // Get member outstanding fines
  getMemberOutstandingFines: (memberId: number): Promise<MemberFinesResponse> =>
    apiClient
      .get<MemberFinesResponse>(`${API_BASE_URL}/member/${memberId}/fines`)
      .then((res) => res.data),

  // Get overdue books
  getOverdueBooks: (): Promise<BorrowedBooksListResponse> =>
    apiClient.get<BorrowedBooksListResponse>(`${API_BASE_URL}/overdue`).then((res) => res.data),

  // Get books due today
  getBooksDueToday: (): Promise<BorrowedBooksListResponse> =>
    apiClient.get<BorrowedBooksListResponse>(`${API_BASE_URL}/due-today`).then((res) => res.data),

  // Get books due within days
  getBooksDueWithin: (days: number): Promise<BorrowedBooksListResponse> =>
    apiClient
      .get<BorrowedBooksListResponse>(`${API_BASE_URL}/due-within?days=${days}`)
      .then((res) => res.data),

  // Get borrowed books by status
  getBorrowedBooksByStatus: (status: BorrowStatus): Promise<BorrowedBooksListResponse> =>
    apiClient
      .get<BorrowedBooksListResponse>(`${API_BASE_URL}/status/${status}`)
      .then((res) => res.data),

  // Get borrowed books by date range
  getBorrowedBooksByDateRange: (start: string, end: string): Promise<BorrowedBooksListResponse> =>
    apiClient
      .get<BorrowedBooksListResponse>(`${API_BASE_URL}/date-range?start=${start}&end=${end}`)
      .then((res) => res.data),

  // Update overdue books (maintenance)
  updateOverdueBooks: (): Promise<ApiResponseDTO<void>> =>
    apiClient
      .put<ApiResponseDTO<void>>(`${API_BASE_URL}/maintenance/update-overdue`)
      .then((res) => res.data),

  // Get borrowing statistics
  getBorrowingStatistics: (): Promise<BorrowingStatsResponse> =>
    apiClient.get<BorrowingStatsResponse>(`${API_BASE_URL}/stats`).then((res) => res.data),
};

// Query Keys
export const borrowedBooksKeys = {
  all: [QUERY_KEYS.BORROWED_BOOKS] as const,
  lists: () => [...borrowedBooksKeys.all, 'list'] as const,
  list: (filters?: BorrowedBookQueryFilters) =>
    [...borrowedBooksKeys.lists(), { filters }] as const,
  details: () => [...borrowedBooksKeys.all, 'detail'] as const,
  detail: (id: number) => [...borrowedBooksKeys.details(), id] as const,
  search: (query?: string | SearchRequestDTO) =>
    [...borrowedBooksKeys.all, 'search', query] as const,
  member: (memberId: number) => [...borrowedBooksKeys.all, 'member', memberId] as const,
  memberCurrent: (memberId: number) => [...borrowedBooksKeys.member(memberId), 'current'] as const,
  memberFines: (memberId: number) => [...borrowedBooksKeys.member(memberId), 'fines'] as const,
  overdue: () => [...borrowedBooksKeys.all, 'overdue'] as const,
  dueToday: () => [...borrowedBooksKeys.all, 'due-today'] as const,
  dueWithin: (days: number) => [...borrowedBooksKeys.all, 'due-within', days] as const,
  status: (status: BorrowStatus) => [...borrowedBooksKeys.all, 'status', status] as const,
  dateRange: (start: string, end: string) =>
    [...borrowedBooksKeys.all, 'date-range', { start, end }] as const,
  stats: () => [...borrowedBooksKeys.all, 'stats'] as const,
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
      queryClient.invalidateQueries({ queryKey: borrowedBooksKeys.stats() });
      if (data.data?.id) {
        queryClient.setQueryData(borrowedBooksKeys.detail(data.data.id), data);
      }
    },
    onError: (error) => console.error('Failed to create borrow book:', error),
    ...options,
  });
};

// Return book
export const useReturnBook = (
  options: UseMutationOptions<BorrowedBooksResponse, ApiError, number> = {}
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: borrowedBooksApi.returnBook,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: borrowedBooksKeys.lists() });
      queryClient.invalidateQueries({ queryKey: borrowedBooksKeys.stats() });
      queryClient.invalidateQueries({ queryKey: borrowedBooksKeys.overdue() });
      queryClient.setQueryData(borrowedBooksKeys.detail(id), data);
    },
    onError: (error) => console.error('Failed to return book:', error),
    ...options,
  });
};

// Extend due date
export const useExtendDueDate = (
  options: UseMutationOptions<BorrowedBooksResponse, ApiError, { id: number; days: number }> = {}
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, days }) => borrowedBooksApi.extendDueDate(id, days),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: borrowedBooksKeys.lists() });
      queryClient.invalidateQueries({ queryKey: borrowedBooksKeys.overdue() });
      queryClient.setQueryData(borrowedBooksKeys.detail(id), data);
    },
    onError: (error) => console.error('Failed to extend due date:', error),
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
      queryClient.invalidateQueries({ queryKey: borrowedBooksKeys.stats() });
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
      queryClient.invalidateQueries({ queryKey: borrowedBooksKeys.stats() });
      queryClient.removeQueries({ queryKey: borrowedBooksKeys.detail(id) });
    },
    onError: (error) => console.error('Failed to delete borrowed book:', error),
    ...options,
  });
};

// Update overdue books (maintenance)
export const useUpdateOverdueBooks = (
  options: UseMutationOptions<ApiResponseDTO<void>, ApiError, void> = {}
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: borrowedBooksApi.updateOverdueBooks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: borrowedBooksKeys.lists() });
      queryClient.invalidateQueries({ queryKey: borrowedBooksKeys.stats() });
      queryClient.invalidateQueries({ queryKey: borrowedBooksKeys.overdue() });
    },
    onError: (error) => console.error('Failed to update overdue books:', error),
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

// // Get borrowed book by ID
// export const useGetBorrowedBookById = (
//   id: number,
//   options: Omit<UseQueryOptions<BorrowedBooksResponse, ApiError>, 'queryKey' | 'queryFn'>
// ) => {
//   return useQuery({
//     queryKey: borrowedBooksKeys.detail(id),
//     queryFn: () => borrowedBooksApi.getBorrowedBookById(id),
//     enabled: !!id,
//     staleTime: 5 * 60 * 1000,
//     ...options,
//   });
// };

// // Advanced search
// export const useSearchBorrowedBooks = (
//   searchRequest: SearchRequestDTO,
//   options: Omit<UseQueryOptions<BorrowedBooksListResponse, ApiError>, 'queryKey' | 'queryFn'>
// ) => {
//   return useQuery({
//     queryKey: borrowedBooksKeys.search(searchRequest),
//     queryFn: () => borrowedBooksApi.searchBorrowedBooks(searchRequest),
//     enabled: !!searchRequest,
//     staleTime: 2 * 60 * 1000, // 2 minutes
//     ...options,
//   });
// };

// // Quick search
// export const useQuickSearchBorrowedBooks = (
//   query: string,
//   options: Omit<UseQueryOptions<BorrowedBooksListResponse, ApiError>, 'queryKey' | 'queryFn'>
// ) => {
//   return useQuery({
//     queryKey: borrowedBooksKeys.search(query),
//     queryFn: () => borrowedBooksApi.quickSearchBorrowedBooks(query),
//     enabled: !!query && query.length > 0,
//     staleTime: 2 * 60 * 1000,
//     ...options,
//   });
// };

// // Get borrowed books by member
// export const useGetBorrowedBooksByMember = (
//   memberId: number,
//   options: Omit<UseQueryOptions<BorrowedBooksListResponse, ApiError>, 'queryKey' | 'queryFn'>
// ) => {
//   return useQuery({
//     queryKey: borrowedBooksKeys.member(memberId),
//     queryFn: () => borrowedBooksApi.getBorrowedBooksByMember(memberId),
//     enabled: !!memberId,
//     staleTime: 5 * 60 * 1000,
//     ...options,
//   });
// };

// // Get current borrowings by member
// export const useGetCurrentBorrowingsByMember = (
//   memberId: number,
//   options: Omit<UseQueryOptions<BorrowedBooksListResponse, ApiError>, 'queryKey' | 'queryFn'>
// ) => {
//   return useQuery({
//     queryKey: borrowedBooksKeys.memberCurrent(memberId),
//     queryFn: () => borrowedBooksApi.getCurrentBorrowingsByMember(memberId),
//     enabled: !!memberId,
//     staleTime: 2 * 60 * 1000,
//     ...options,
//   });
// };

// // Get member outstanding fines
// export const useGetMemberOutstandingFines = (
//   memberId: number,
//   options: Omit<UseQueryOptions<MemberFinesResponse, ApiError>, 'queryKey' | 'queryFn'>
// ) => {
//   return useQuery({
//     queryKey: borrowedBooksKeys.memberFines(memberId),
//     queryFn: () => borrowedBooksApi.getMemberOutstandingFines(memberId),
//     enabled: !!memberId,
//     staleTime: 5 * 60 * 1000,
//     ...options,
//   });
// };

// // Get overdue books
// export const useGetOverdueBooks = (
//   options: Omit<UseQueryOptions<BorrowedBooksListResponse, ApiError>, 'queryKey' | 'queryFn'>
// ) => {
//   return useQuery({
//     queryKey: borrowedBooksKeys.overdue(),
//     queryFn: borrowedBooksApi.getOverdueBooks,
//     staleTime: 2 * 60 * 1000,
//     ...options,
//   });
// };

// // Get books due today
// export const useGetBooksDueToday = (
//   options: Omit<UseQueryOptions<BorrowedBooksListResponse, ApiError>, 'queryKey' | 'queryFn'>
// ) => {
//   return useQuery({
//     queryKey: borrowedBooksKeys.dueToday(),
//     queryFn: borrowedBooksApi.getBooksDueToday,
//     staleTime: 5 * 60 * 1000,
//     ...options,
//   });
// };

// // Get books due within days
// export const useGetBooksDueWithin = (
//   days: number,
//   options: Omit<UseQueryOptions<BorrowedBooksListResponse, ApiError>, 'queryKey' | 'queryFn'>
// ) => {
//   return useQuery({
//     queryKey: borrowedBooksKeys.dueWithin(days),
//     queryFn: () => borrowedBooksApi.getBooksDueWithin(days),
//     enabled: !!days && days > 0,
//     staleTime: 5 * 60 * 1000,
//     ...options,
//   });
// };

// // Get borrowed books by status
// export const useGetBorrowedBooksByStatus = (
//   status: BorrowStatus,
//   options: Omit<UseQueryOptions<BorrowedBooksListResponse, ApiError>, 'queryKey' | 'queryFn'>
// ) => {
//   return useQuery({
//     queryKey: borrowedBooksKeys.status(status),
//     queryFn: () => borrowedBooksApi.getBorrowedBooksByStatus(status),
//     enabled: !!status,
//     staleTime: 5 * 60 * 1000,
//     ...options,
//   });
// };

// // Get borrowed books by date range
// export const useGetBorrowedBooksByDateRange = (
//   start: string,
//   end: string,
//   options: Omit<UseQueryOptions<BorrowedBooksListResponse, ApiError>, 'queryKey' | 'queryFn'>
// ) => {
//   return useQuery({
//     queryKey: borrowedBooksKeys.dateRange(start, end),
//     queryFn: () => borrowedBooksApi.getBorrowedBooksByDateRange(start, end),
//     enabled: !!start && !!end,
//     staleTime: 10 * 60 * 1000, // 10 minutes for historical data
//     ...options,
//   });
// };

// // Get borrowing statistics
// export const useGetBorrowingStatistics = (
//   options: Omit<UseQueryOptions<BorrowingStatsResponse, ApiError>, 'queryKey' | 'queryFn'>
// ) => {
//   return useQuery({
//     queryKey: borrowedBooksKeys.stats(),
//     queryFn: borrowedBooksApi.getBorrowingStatistics,
//     staleTime: 5 * 60 * 1000,
//     ...options,
//   });
// };
