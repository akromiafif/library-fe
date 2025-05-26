import React, { useState, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { DashboardContent } from 'src/layouts/dashboard';
import { BorrowedBookItem } from '../borrowed-book-item';
import { useGetAllBorrowedBooks } from 'src/api/hooks/borrowedBookQueries';
import { BorrowedBookDTO } from 'src/api/types/borrowed-book.type';
import { BorrowedBooksSearch } from '../borrowed-book-search';
import { BorrowedBooksSort } from '../borrowed-book-sort';

// Sort options for borrowed books
const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest Borrowed' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'memberName', label: 'Member Name' },
  { value: 'bookTitle', label: 'Book Title' },
  { value: 'status', label: 'Status' },
];

// Items per page for frontend pagination
const ITEMS_PER_PAGE = 12;

export function BorrowedBooksView() {
  const [page, setPage] = useState(1); // 1-based for MUI Pagination
  const [sortBy, setSortBy] = useState<string>('latest');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch all borrowed books (assuming API returns all books)
  const {
    data: borrowedBooksResponse,
    isLoading,
    isError,
    error,
  } = useGetAllBorrowedBooks(0, 1000); // Fetch a large number to get all books

  const borrowedBooks: BorrowedBookDTO[] = borrowedBooksResponse?.data || [];

  // Filter borrowed books based on search query
  const filteredBorrowedBooks = useMemo(() => {
    if (!searchQuery) return borrowedBooks;
    return borrowedBooks.filter(
      (book) =>
        book.bookTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.authorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.memberName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [borrowedBooks, searchQuery]);

  // Sort filtered books
  const sortedBorrowedBooks = useMemo(() => {
    const books = [...filteredBorrowedBooks];
    switch (sortBy) {
      case 'latest':
        return books.sort(
          (a, b) => new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime()
        );
      case 'dueDate':
        return books.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      case 'memberName':
        return books.sort((a, b) => a.memberName!.localeCompare(b.memberName!));
      case 'bookTitle':
        return books.sort((a, b) => a.bookTitle!.localeCompare(b.bookTitle!));
      case 'status':
        return books.sort((a, b) => a.status.localeCompare(b.status));
      default:
        return books;
    }
  }, [filteredBorrowedBooks, sortBy]);

  // Calculate pagination values
  const totalItems = sortedBorrowedBooks.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentPageItems = sortedBorrowedBooks.slice(startIndex, endIndex);

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
    setPage(1); // Reset to first page when sorting
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page when searching
  }, []);

  const handlePageChange = useCallback((_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle loading state
  if (isLoading) {
    return (
      <DashboardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 400,
          }}
        >
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <DashboardContent>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load borrowed books: {error?.message || 'Unknown error'}
        </Alert>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Borrowed Books
        </Typography>
      </Box>

      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <BorrowedBooksSearch borrowedBooks={borrowedBooks} onSearch={handleSearch} />
        <BorrowedBooksSort sortBy={sortBy} onSort={handleSort} options={SORT_OPTIONS} />
      </Box>

      {/* Summary Stats */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {startIndex + 1}-{endIndex} of {totalItems} borrowed books
          {searchQuery && ` (filtered by "${searchQuery}")`}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {currentPageItems.map((borrowedBook: BorrowedBookDTO, index) => {
          const latestPostLarge = index === 0;
          const latestPost = index === 1 || index === 2;

          return (
            <Grid
              key={borrowedBook.id}
              size={{
                xs: 12,
                sm: latestPostLarge ? 12 : 6,
                md: latestPostLarge ? 6 : 3,
              }}
            >
              <BorrowedBookItem
                borrowedBook={borrowedBook}
                latestPost={latestPost}
                latestPostLarge={latestPostLarge}
              />
            </Grid>
          );
        })}
      </Grid>

      {/* Empty state */}
      {sortedBorrowedBooks.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            {searchQuery ? 'No borrowed books match your search' : 'No borrowed books found'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {searchQuery
              ? 'Try adjusting your search terms or clear the search to see all books.'
              : 'Start by borrowing some books to see them here.'}
          </Typography>
        </Box>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 4,
            mb: 2,
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                fontSize: '0.875rem',
              },
            }}
          />
        </Box>
      )}

      {/* Pagination info */}
      {totalPages > 1 && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Page {page} of {totalPages}
          </Typography>
        </Box>
      )}
    </DashboardContent>
  );
}
