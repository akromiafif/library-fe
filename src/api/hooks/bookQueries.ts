// src/api/hooks/bookQueries.ts
import type { AxiosResponse, AxiosError } from 'axios';
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { API_ENDPOINTS, QUERY_KEYS } from 'src/constants/api.constants';
import apiClient from '../axiosConfig';
import type { ApiResponseDTO } from '../types/api-response.types';
import type { BookDTO, BookCreateRequest, BookQueryFilters } from '../types/book.types';

const BASE = API_ENDPOINTS.BOOKS;

type BookResponse = ApiResponseDTO<BookDTO>;
type BooksListResponse = ApiResponseDTO<BookDTO[]>;
type DeleteResponse = ApiResponseDTO<void>;

interface ApiError extends AxiosError {
  response?: AxiosResponse<ApiResponseDTO<null>>;
}

// Custom Hook Options Types
export type UseBooksOptions = Omit<
  UseQueryOptions<BooksListResponse, ApiError>,
  'queryKey' | 'queryFn'
>;
export type UseBookOptions = Omit<UseQueryOptions<BookResponse, ApiError>, 'queryKey' | 'queryFn'>;
export type UseCreateBookOptions = Omit<
  UseMutationOptions<BookResponse, ApiError, BookCreateRequest>,
  'mutationFn'
>;
export type UseUpdateBookOptions = Omit<
  UseMutationOptions<BookResponse, ApiError, { id: number; data: BookCreateRequest }>,
  'mutationFn'
>;
export type UseDeleteBookOptions = Omit<
  UseMutationOptions<DeleteResponse, ApiError, number>,
  'mutationFn'
>;

export const bookApi = {
  createBook: (data: BookCreateRequest) =>
    apiClient.post<BookResponse>(BASE, data).then((r) => r.data),

  getAllBooks: () => apiClient.get<BooksListResponse>(BASE).then((r) => r.data),

  getBook: (id: number) => apiClient.get<BookResponse>(`${BASE}/${id}`).then((r) => r.data),

  updateBook: ({ id, data }: { id: number; data: BookCreateRequest }) =>
    apiClient.put<BookResponse>(`${BASE}/${id}`, data).then((r) => r.data),

  deleteBook: (id: number) => apiClient.delete<DeleteResponse>(`${BASE}/${id}`).then((r) => r.data),
};

export const bookKeys = {
  all: [QUERY_KEYS.BOOKS] as const,
  lists: () => [...bookKeys.all, 'list'] as const,
  list: (filters?: BookQueryFilters) => [...bookKeys.lists(), { filters }] as const,
  detail: (id: number) => [...bookKeys.all, 'detail', id] as const,
};

export const useBooks = (options: UseBooksOptions = {}) =>
  useQuery({
    queryKey: bookKeys.list(),
    queryFn: bookApi.getAllBooks,
    staleTime: 300_000,
    ...options,
  });

export const useBook = (id?: number, options: UseBookOptions = {}) =>
  useQuery({
    queryKey: bookKeys.detail(id!),
    queryFn: () => bookApi.getBook(id!),
    enabled: !!id,
    ...options,
  });

export const useCreateBook = (options: UseCreateBookOptions = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookApi.createBook,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
      if (data.data?.id) queryClient.setQueryData(bookKeys.detail(data.data.id), data);
    },
    ...options,
  });
};

export const useUpdateBook = (options: UseUpdateBookOptions = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => bookApi.updateBook({ id, data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookKeys.detail(id) });
    },
    ...options,
  });
};

export const useDeleteBook = (options: UseDeleteBookOptions = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookApi.deleteBook,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookKeys.detail(id) });
    },
    ...options,
  });
};
