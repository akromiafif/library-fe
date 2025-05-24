// authorQueries.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { AuthorDTO, AuthorCreateRequest, AuthorQueryFilters } from '../types/author.types';
import { ApiResponseDTO } from '../types/api-response.types';
import apiClient from '../axiosConfig';

// Base URL for the API
const API_BASE_URL = '/authors'; // uses apiClient.baseURL

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
  // Create author
  createAuthor: async (authorData: AuthorCreateRequest): Promise<AuthorResponse> => {
    const response = await apiClient.post<AuthorResponse>(API_BASE_URL, authorData);
    return response.data;
  },

  // Get all authors
  getAllAuthors: async (): Promise<AuthorsListResponse> => {
    const response = await apiClient.get<AuthorsListResponse>(API_BASE_URL);
    return response.data;
  },

  // Get author by ID
  getAuthorById: async (id: number): Promise<AuthorResponse> => {
    const response = await apiClient.get<AuthorResponse>(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  // Get author by ID with books
  getAuthorByIdWithBooks: async (id: number): Promise<AuthorResponse> => {
    const response = await apiClient.get<AuthorResponse>(`${API_BASE_URL}/${id}/books`);
    return response.data;
  },

  // Update author
  updateAuthor: async ({
    id,
    authorData,
  }: {
    id: number;
    authorData: AuthorCreateRequest;
  }): Promise<AuthorResponse> => {
    const response = await apiClient.put<AuthorResponse>(`${API_BASE_URL}/${id}`, authorData);
    return response.data;
  },

  // Delete author
  deleteAuthor: async (id: number): Promise<DeleteResponse> => {
    const response = await apiClient.delete<DeleteResponse>(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  // Search authors by name
  searchAuthorsByName: async (name: string): Promise<AuthorsListResponse> => {
    const response = await apiClient.get<AuthorsListResponse>(`${API_BASE_URL}/search`, {
      params: { name },
    });
    return response.data;
  },

  // Get authors by nationality
  getAuthorsByNationality: async (nationality: string): Promise<AuthorsListResponse> => {
    const response = await apiClient.get<AuthorsListResponse>(
      `${API_BASE_URL}/nationality/${nationality}`
    );
    return response.data;
  },
};

// Query Keys
export const authorKeys = {
  all: ['authors'] as const,
  lists: () => [...authorKeys.all, 'list'] as const,
  list: (filters?: AuthorQueryFilters) => [...authorKeys.lists(), { filters }] as const,
  details: () => [...authorKeys.all, 'detail'] as const,
  detail: (id: number) => [...authorKeys.details(), id] as const,
  detailWithBooks: (id: number) => [...authorKeys.details(), id, 'books'] as const,
  search: (name: string) => [...authorKeys.all, 'search', name] as const,
  nationality: (nationality: string) => [...authorKeys.all, 'nationality', nationality] as const,
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

// 1. Get all authors
export const useAuthors = (options: UseAuthorsOptions = {}) => {
  return useQuery<AuthorsListResponse, ApiError>({
    queryKey: authorKeys.lists(),
    queryFn: authorApi.getAllAuthors,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// 2. Get author by ID
export const useAuthor = (id: number | undefined, options: UseAuthorOptions = {}) => {
  return useQuery<AuthorResponse, ApiError>({
    queryKey: authorKeys.detail(id!),
    queryFn: () => authorApi.getAuthorById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// 3. Get author by ID with books
export const useAuthorWithBooks = (id: number | undefined, options: UseAuthorOptions = {}) => {
  return useQuery<AuthorResponse, ApiError>({
    queryKey: authorKeys.detailWithBooks(id!),
    queryFn: () => authorApi.getAuthorByIdWithBooks(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// 4. Search authors by name
export const useSearchAuthors = (
  name: string | undefined,
  options: Omit<UseQueryOptions<AuthorsListResponse, ApiError>, 'queryKey' | 'queryFn'> = {}
) => {
  return useQuery<AuthorsListResponse, ApiError>({
    queryKey: authorKeys.search(name!),
    queryFn: () => authorApi.searchAuthorsByName(name!),
    enabled: !!name && name.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    ...options,
  });
};

// 5. Get authors by nationality
export const useAuthorsByNationality = (
  nationality: string | undefined,
  options: Omit<UseQueryOptions<AuthorsListResponse, ApiError>, 'queryKey' | 'queryFn'> = {}
) => {
  return useQuery<AuthorsListResponse, ApiError>({
    queryKey: authorKeys.nationality(nationality!),
    queryFn: () => authorApi.getAuthorsByNationality(nationality!),
    enabled: !!nationality,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// Mutation Hooks

// 1. Create author mutation
export const useCreateAuthor = (options: UseCreateAuthorOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation<AuthorResponse, ApiError, AuthorCreateRequest>({
    mutationFn: authorApi.createAuthor,
    onSuccess: (data) => {
      // Invalidate and refetch authors list
      queryClient.invalidateQueries({ queryKey: authorKeys.lists() });

      // Optionally set the new author data in cache
      if (data.data?.id) {
        queryClient.setQueryData(authorKeys.detail(data.data.id), data);
      }
    },
    onError: (error: ApiError) => {
      console.error('Failed to create author:', error);
    },
    ...options,
  });
};

// 2. Update author mutation
export const useUpdateAuthor = (options: UseUpdateAuthorOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation<AuthorResponse, ApiError, { id: number; authorData: AuthorCreateRequest }>({
    mutationFn: authorApi.updateAuthor,
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Update the specific author in cache
      queryClient.setQueryData(authorKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: authorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: authorKeys.detailWithBooks(id) });
    },
    onError: (error: ApiError) => {
      console.error('Failed to update author:', error);
    },
    ...options,
  });
};

// 3. Delete author mutation
export const useDeleteAuthor = (options: UseDeleteAuthorOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, ApiError, number>({
    mutationFn: authorApi.deleteAuthor,
    onSuccess: (data, authorId) => {
      // Remove the author from cache
      queryClient.removeQueries({ queryKey: authorKeys.detail(authorId) });
      queryClient.removeQueries({ queryKey: authorKeys.detailWithBooks(authorId) });

      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: authorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: authorKeys.all });
    },
    onError: (error: ApiError) => {
      console.error('Failed to delete author:', error);
    },
    ...options,
  });
};

// Utility hook for prefetching
export const usePrefetchAuthor = () => {
  const queryClient = useQueryClient();

  return (id: number): void => {
    queryClient.prefetchQuery({
      queryKey: authorKeys.detail(id),
      queryFn: () => authorApi.getAuthorById(id),
      staleTime: 5 * 60 * 1000,
    });
  };
};
