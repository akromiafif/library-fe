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
import { MemberCreateRequest, MemberDTO, MemberQueryFilters } from '../types/member.types';

// Base URL for the API
const API_BASE_URL = API_ENDPOINTS.MEMBERS;

// API Response Types
type MemberResponse = ApiResponseDTO<MemberDTO>;
type MembersListResponse = ApiResponseDTO<MemberDTO[]>;
type DeleteResponse = ApiResponseDTO<void>;

// API Error Type
interface ApiError extends AxiosError {
  response?: AxiosResponse<ApiResponseDTO<null>>;
}

// API functions
export const memberApi = {
  createMember: (memberData: MemberCreateRequest): Promise<MemberResponse> =>
    apiClient.post<MemberResponse>(API_BASE_URL, memberData).then((res) => res.data),

  getAllMembers: (): Promise<MembersListResponse> =>
    apiClient.get<MembersListResponse>(API_BASE_URL).then((res) => res.data),

  getMemberById: (id: number): Promise<MemberResponse> =>
    apiClient.get<MemberResponse>(`${API_BASE_URL}/${id}`).then((res) => res.data),

  getMemberByIdWithBorrowedBooks: (id: number): Promise<MemberResponse> =>
    apiClient.get<MemberResponse>(`${API_BASE_URL}/${id}/borrowed-books`).then((res) => res.data),

  updateMember: ({
    id,
    memberData,
  }: {
    id: number;
    memberData: MemberCreateRequest;
  }): Promise<MemberResponse> =>
    apiClient.put<MemberResponse>(`${API_BASE_URL}/${id}`, memberData).then((res) => res.data),

  deleteMember: (id: number): Promise<DeleteResponse> =>
    apiClient.delete<DeleteResponse>(`${API_BASE_URL}/${id}`).then((res) => res.data),

  searchMembers: (searchTerm: string): Promise<MembersListResponse> =>
    apiClient
      .get<MembersListResponse>(`${API_BASE_URL}/search`, {
        params: { searchTerm },
      })
      .then((res) => res.data),

  getMemberByEmail: (email: string): Promise<MemberResponse> =>
    apiClient
      .get<MemberResponse>(`${API_BASE_URL}/email/${encodeURIComponent(email)}`)
      .then((res) => res.data),
};

// Query Keys
export const memberKeys = {
  all: [QUERY_KEYS.MEMBERS] as const,
  lists: () => [...memberKeys.all, 'list'] as const,
  list: (filters?: MemberQueryFilters) => [...memberKeys.lists(), { filters }] as const,
  details: () => [...memberKeys.all, 'detail'] as const,
  detail: (id: number) => [...memberKeys.details(), id] as const,
  detailWithBooks: (id: number) => [...memberKeys.details(), id, 'borrowed-books'] as const,
  search: (term: string) => [...memberKeys.all, 'search', term] as const,
  byEmail: (email: string) => [...memberKeys.all, 'email', email] as const,
};

// Custom Hook Options Types
type UseMembersOptions = Omit<
  UseQueryOptions<MembersListResponse, ApiError>,
  'queryKey' | 'queryFn'
>;

type UseMemberOptions = Omit<UseQueryOptions<MemberResponse, ApiError>, 'queryKey' | 'queryFn'>;

// Custom Hooks
export const useMembers = (options: UseMembersOptions = {}) =>
  useQuery({
    queryKey: memberKeys.lists(),
    queryFn: memberApi.getAllMembers,
    staleTime: 300_000,
    ...options,
  });

export const useMember = (id?: number, options: UseMemberOptions = {}) =>
  useQuery({
    queryKey: memberKeys.detail(id!),
    queryFn: () => memberApi.getMemberById(id!),
    enabled: !!id,
    staleTime: 300_000,
    ...options,
  });

export const useMemberWithBorrowedBooks = (id?: number, options: UseMemberOptions = {}) =>
  useQuery({
    queryKey: memberKeys.detailWithBooks(id!),
    queryFn: () => memberApi.getMemberByIdWithBorrowedBooks(id!),
    enabled: !!id,
    staleTime: 300_000,
    ...options,
  });

export const useSearchMembers = (
  term?: string,
  options: Omit<UseQueryOptions<MembersListResponse, ApiError>, 'queryKey' | 'queryFn'> = {}
) =>
  useQuery({
    queryKey: memberKeys.search(term!),
    queryFn: () => memberApi.searchMembers(term!),
    enabled: !!term && term.length > 0,
    staleTime: 120_000,
    ...options,
  });

export const useMemberByEmail = (
  email?: string,
  options: Omit<UseQueryOptions<MemberResponse, ApiError>, 'queryKey' | 'queryFn'> = {}
) =>
  useQuery({
    queryKey: memberKeys.byEmail(email!),
    queryFn: () => memberApi.getMemberByEmail(email!),
    enabled: !!email && email.length > 0,
    staleTime: 300_000,
    ...options,
  });

export const useCreateMember = (
  options: UseMutationOptions<MemberResponse, ApiError, MemberCreateRequest> = {}
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: memberApi.createMember,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
      if (data.data?.id) queryClient.setQueryData(memberKeys.detail(data.data.id), data);
    },
    onError: (error) => console.error('Failed to create member:', error),
    ...options,
  });
};

export const useUpdateMember = (
  options: UseMutationOptions<
    MemberResponse,
    ApiError,
    { id: number; memberData: MemberCreateRequest }
  > = {}
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: memberApi.updateMember,
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(memberKeys.detail(id), data);
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
      queryClient.invalidateQueries({ queryKey: memberKeys.detailWithBooks(id) });
    },
    onError: (error) => console.error('Failed to update member:', error),
    ...options,
  });
};

export const useDeleteMember = (
  options: UseMutationOptions<DeleteResponse, ApiError, number> = {}
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: memberApi.deleteMember,
    onSuccess: (_, memberId) => {
      queryClient.removeQueries({ queryKey: memberKeys.detail(memberId) });
      queryClient.removeQueries({
        queryKey: memberKeys.detailWithBooks(memberId),
      });
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
    },
    onError: (error) => console.error('Failed to delete member:', error),
    ...options,
  });
};

export const usePrefetchMember = () => {
  const queryClient = useQueryClient();
  return (id: number) =>
    queryClient.prefetchQuery({
      queryKey: memberKeys.detail(id),
      queryFn: () => memberApi.getMemberById(id),
      staleTime: 300_000,
    });
};
