// authorQueries.ts
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
import type { AuthorDTO, AuthorCreateRequest, AuthorQueryFilters } from '../types/author.types';

// Base URL for the API
const API_BASE_URL = API_ENDPOINTS.AUTHORS; // uses apiClient.baseURL

// API Response Types
type AuthorResponse = ApiResponseDTO<AuthorDTO>;
type AuthorsListResponse = ApiResponseDTO<AuthorDTO[]>;
type DeleteResponse = ApiResponseDTO<void>;

// API Error Type
interface ApiError extends AxiosError {
  response?: AxiosResponse<ApiResponseDTO<null>>;
}

// API functions
const authorApi = {
  createAuthor: (authorData: AuthorCreateRequest): Promise<AuthorResponse> =>
    apiClient.post<AuthorResponse>(API_BASE_URL, authorData).then((res) => res.data),

  getAllAuthors: (): Promise<AuthorsListResponse> =>
    apiClient.get<AuthorsListResponse>(API_BASE_URL).then((res) => res.data),

  getAuthorById: (id: number): Promise<AuthorResponse> =>
    apiClient.get<AuthorResponse>(`${API_BASE_URL}/${id}`).then((res) => res.data),

  updateAuthor: ({
    id,
    authorData,
  }: {
    id: number;
    authorData: AuthorCreateRequest;
  }): Promise<AuthorResponse> =>
    apiClient.put<AuthorResponse>(`${API_BASE_URL}/${id}`, authorData).then((res) => res.data),

  deleteAuthor: (id: number): Promise<DeleteResponse> =>
    apiClient.delete<DeleteResponse>(`${API_BASE_URL}/${id}`).then((res) => res.data),
};

// Query Keys
export const authorKeys = {
  all: [QUERY_KEYS.AUTHORS] as const,
  lists: () => [...authorKeys.all, 'list'] as const,
  list: (filters?: AuthorQueryFilters) => [...authorKeys.lists(), { filters }] as const,
  details: () => [...authorKeys.all, 'detail'] as const,
  detail: (id: number) => [...authorKeys.details(), id] as const,
  detailWithBooks: (id: number) => [...authorKeys.details(), id, 'books'] as const,
};

// Custom Hook Options Types
type UseAuthorsOptions = Omit<
  UseQueryOptions<AuthorsListResponse, ApiError>,
  'queryKey' | 'queryFn'
>;

type UseAuthorOptions = Omit<UseQueryOptions<AuthorResponse, ApiError>, 'queryKey' | 'queryFn'>;
type UseCreateAuthorOptions = Omit<
  UseMutationOptions<AuthorResponse, ApiError, AuthorCreateRequest>,
  'mutationFn'
>;

type UseUpdateAuthorOptions = Omit<
  UseMutationOptions<AuthorResponse, ApiError, { id: number; authorData: AuthorCreateRequest }>,
  'mutationFn'
>;
type UseDeleteAuthorOptions = Omit<
  UseMutationOptions<DeleteResponse, ApiError, number>,
  'mutationFn'
>;

// Custom Hooks
export const useAuthors = (options: UseAuthorsOptions = {}) =>
  useQuery({
    queryKey: authorKeys.lists(),
    queryFn: authorApi.getAllAuthors,
    staleTime: 300_000,
    ...options,
  });

export const useAuthor = (id?: number, options: UseAuthorOptions = {}) =>
  useQuery({
    queryKey: authorKeys.detail(id!),
    queryFn: () => authorApi.getAuthorById(id!),
    enabled: !!id,
    staleTime: 300_000,
    ...options,
  });

export const useCreateAuthor = (options: UseCreateAuthorOptions = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authorApi.createAuthor,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: authorKeys.lists() });
      if (data.data?.id) queryClient.setQueryData(authorKeys.detail(data.data.id), data);
    },
    onError: (error) => console.error('Failed to create author:', error),
    ...options,
  });
};

export const useUpdateAuthor = (options: UseUpdateAuthorOptions = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authorApi.updateAuthor,
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(authorKeys.detail(id), data);
      queryClient.invalidateQueries({ queryKey: authorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: authorKeys.detailWithBooks(id) });
    },
    onError: (error) => console.error('Failed to update author:', error),
    ...options,
  });
};

export const useDeleteAuthor = (options: UseDeleteAuthorOptions = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authorApi.deleteAuthor,
    onSuccess: (_, authorId) => {
      queryClient.removeQueries({ queryKey: authorKeys.detail(authorId) });
      queryClient.removeQueries({ queryKey: authorKeys.detailWithBooks(authorId) });
      queryClient.invalidateQueries({ queryKey: authorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: authorKeys.all });
    },
    onError: (error) => console.error('Failed to delete author:', error),
    ...options,
  });
};
