import type { AxiosResponse, AxiosError } from 'axios';
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';

import { API_ENDPOINTS, QUERY_KEYS } from 'src/constants/api.constants';
import apiClient from '../axiosConfig';

import type { ApiResponseDTO } from '../types/api-response.types';
import {
  BorrowedBookCreateRequest,
  BorrowedBookDTO,
  BorrowedBookQueryFilters,
} from '../types/borrowed-book.type';

// Base URL for the API
const API_BASE_URL = API_ENDPOINTS.BORROWED_BOOKS;

// API Response Types
type BorrowedBooksResponse = ApiResponseDTO<BorrowedBookDTO>;

// API Error Type
interface ApiError extends AxiosError {
  response?: AxiosResponse<ApiResponseDTO<null>>;
}

// API functions
export const borrowedBooksApi = {
  createBorrowedBooks: (memberData: BorrowedBookCreateRequest): Promise<BorrowedBooksResponse> =>
    apiClient
      .post<BorrowedBooksResponse>(`${API_BASE_URL}/borrow`, memberData)
      .then((res) => res.data),
};

// Query Keys
export const borrowedBooksKeys = {
  all: [QUERY_KEYS.MEMBERS] as const,
  lists: () => [...borrowedBooksKeys.all, 'list'] as const,
  list: (filters?: BorrowedBookQueryFilters) =>
    [...borrowedBooksKeys.lists(), { filters }] as const,
  details: () => [...borrowedBooksKeys.all, 'detail'] as const,
  detail: (id: number) => [...borrowedBooksKeys.details(), id] as const,
};

export const useCreateBorrowedBooks = (
  options: UseMutationOptions<BorrowedBooksResponse, ApiError, BorrowedBookCreateRequest> = {}
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: borrowedBooksApi.createBorrowedBooks,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: borrowedBooksKeys.lists() });
      if (data.data?.id) queryClient.setQueryData(borrowedBooksKeys.detail(data.data.id), data);
    },
    onError: (error) => console.error('Failed to create borrow book:', error),
    ...options,
  });
};
