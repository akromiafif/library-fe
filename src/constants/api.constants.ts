// constants/api.constants.ts - API constants
export const API_ENDPOINTS = {
  AUTHORS: '/authors',
  MEMBERS: '/members',
  BOOKS: '/books',
  CATEGORIES: '/categories',
} as const;

export const QUERY_KEYS = {
  AUTHORS: 'authors',
  MEMBERS: 'members',
  BOOKS: 'books',
  CATEGORIES: 'categories',
} as const;

export const CACHE_TIME = {
  SHORT: 2 * 60 * 1000, // 2 minutes
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 10 * 60 * 1000, // 10 minutes
} as const;
