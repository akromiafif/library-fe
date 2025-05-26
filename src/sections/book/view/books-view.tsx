import { useState, useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';

import { BookItem } from '../book-item';
import { BookSort } from '../book-sort';
import { BookFilters } from '../book-filters';
import { BookDTO } from 'src/api/types/book.types';
import { useBooks, useCreateBook, useDeleteBook, useUpdateBook } from 'src/api/hooks/bookQueries';
import { BookFormData, BookModal } from './book-modal';
import { useAuthors } from 'src/api/hooks/authorQueries';
import { BorrowedBookFormData, BorrowModal } from './book-borrow-modal';
import { useMembers } from 'src/api/hooks/memberQueries';
import { useCreateBorrowedBooks } from 'src/api/hooks/borrowedBookQueries';

// ----------------------------------------------------------------------

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'fiction', label: 'Fiction' },
  { value: 'non-fiction', label: 'Non-Fiction' },
  { value: 'science', label: 'Science' },
  { value: 'technology', label: 'Technology' },
  { value: 'history', label: 'History' },
  { value: 'biography', label: 'Biography' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'romance', label: 'Romance' },
];

const AVAILABILITY_OPTIONS = [
  { value: 'all', label: 'All Books' },
  { value: 'available', label: 'Available' },
  { value: 'unavailable', label: 'Out of Stock' },
];

const YEAR_OPTIONS = [
  { value: 'all', label: 'All Years' },
  { value: '2020s', label: '2020s' },
  { value: '2010s', label: '2010s' },
  { value: '2000s', label: '2000s' },
  { value: 'before2000', label: 'Before 2000' },
];

// Updated filters for books
const defaultFilters = {
  category: CATEGORY_OPTIONS[0].value,
  availability: AVAILABILITY_OPTIONS[0].value,
  year: YEAR_OPTIONS[0].value,
  search: '',
};

interface BookFiltersProps {
  category: string;
  availability: string;
  year: string;
  search: string;
}

interface EditBookFormData {
  title: string;
  category: string;
  publishingYear: number;
  isbn: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  authorName: string;
  authorId: number;
}

export function BooksView() {
  const [sortBy, setSortBy] = useState('title');
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState<BookFiltersProps>(defaultFilters);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [selectedBook, setSelectedBook] = useState<BookDTO | null>(null);
  const [editFormData, setEditFormData] = useState<EditBookFormData>({
    title: '',
    category: '',
    publishingYear: new Date().getFullYear(),
    isbn: '',
    description: '',
    totalCopies: 1,
    availableCopies: 1,
    authorName: '',
    authorId: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Use the books hook
  const { data: booksResponse, isLoading, error: booksError } = useBooks();
  const deleteMutation = useDeleteBook();
  const updateMutation = useUpdateBook();
  const createMutation = useCreateBook();

  const { mutateAsync: createBorrowedBooks } = useCreateBorrowedBooks();

  const { data: authorsResponse, isLoading: authorsLoading } = useAuthors();

  const { data: membersResponse, isLoading: membersLoading } = useMembers();

  const handleOpenFilter = useCallback(() => {
    setOpenFilter(true);
  }, []);

  const handleCloseFilter = useCallback(() => {
    setOpenFilter(false);
  }, []);

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);

  const handleSetFilters = useCallback((updateState: Partial<BookFiltersProps>) => {
    setFilters((prevValue) => ({ ...prevValue, ...updateState }));
    setPage(1); // Reset to first page when filters change
  }, []);

  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  }, []);

  // Book edit/delete handlers
  const handleBookClick = useCallback((book: BookDTO) => {
    setSelectedBook(book);
    setEditFormData({
      title: book.title,
      category: book.category,
      publishingYear: book.publishingYear,
      isbn: book.isbn || '',
      description: book.description || '',
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      authorName: book.authorName || '',
      authorId: book.authorId,
    });
    setEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditModalOpen(false);
    setSelectedBook(null);
    setEditFormData({
      title: '',
      category: '',
      publishingYear: new Date().getFullYear(),
      isbn: '',
      description: '',
      totalCopies: 1,
      availableCopies: 1,
      authorName: '',
      authorId: 1,
    });
  }, []);

  const handleBorrowModalClose = useCallback(() => {
    setBorrowModalOpen(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedBook(null);
    setEditFormData({
      title: '',
      category: '',
      publishingYear: new Date().getFullYear(),
      isbn: '',
      description: '',
      totalCopies: 1,
      availableCopies: 1,
      authorName: '',
      authorId: 1,
    });
  }, []);

  const handleBorrowSave = useCallback(
    async (formData: BorrowedBookFormData) => {
      try {
        await createBorrowedBooks(formData);

        setSnackbarMessage('Borrowed book created successfully!');
        setSnackbarOpen(true);
        handleCloseModal();
      } catch (_) {
        setSnackbarMessage('Failed to created book. Please try again.');
        setSnackbarOpen(true);
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleBorrowModalClose]
  );

  const handleSaveBook = useCallback(
    async (data: BookFormData) => {
      if (!selectedBook) return;

      setIsSubmitting(true);
      try {
        await updateMutation.mutate({
          id: selectedBook.id,
          data,
        });

        setSnackbarMessage('Book updated successfully!');
        setSnackbarOpen(true);
        handleCloseEditModal();
      } catch (_) {
        setSnackbarMessage('Failed to update book. Please try again.');
        setSnackbarOpen(true);
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedBook, editFormData, handleCloseEditModal]
  );

  const handleCreateBook = useCallback(
    async (formData: BookFormData) => {
      setIsSubmitting(true);
      try {
        await createMutation.mutate(formData);

        setSnackbarMessage('Book created successfully!');
        setSnackbarOpen(true);
        handleCloseModal();
      } catch (_) {
        setSnackbarMessage('Failed to created book. Please try again.');
        setSnackbarOpen(true);
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedBook, editFormData, handleCloseEditModal]
  );

  const handleDeleteBook = useCallback(async () => {
    if (!selectedBook) return;

    setIsSubmitting(true);
    try {
      await deleteMutation.mutate(selectedBook.id);

      setSnackbarMessage('Book deleted successfully!');
      setSnackbarOpen(true);
      handleCloseEditModal();
    } catch (_) {
      setSnackbarMessage('Failed to delete book. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedBook, handleCloseEditModal]);

  const handleBorrowClick = useCallback((book: BookDTO) => {
    setSelectedBook(book);
    setBorrowModalOpen(true);
  }, []);

  // Filter and sort books
  const filteredAndSortedBooks = useMemo(() => {
    if (!booksResponse?.data) return [];

    let books = [...booksResponse.data];

    // Apply filters
    if (filters.category !== 'all') {
      books = books.filter(
        (book) => book.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.availability !== 'all') {
      books = books.filter((book) => {
        if (filters.availability === 'available') {
          return book.availableCopies > 0;
        } else {
          return book.availableCopies === 0;
        }
      });
    }

    if (filters.year !== 'all') {
      books = books.filter((book) => {
        const year = book.publishingYear;
        switch (filters.year) {
          case '2020s':
            return year >= 2020;
          case '2010s':
            return year >= 2010 && year < 2020;
          case '2000s':
            return year >= 2000 && year < 2010;
          case 'before2000':
            return year < 2000;
          default:
            return true;
        }
      });
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      books = books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm) ||
          book.authorName?.toLowerCase().includes(searchTerm) ||
          book.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    books.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'titleDesc':
          return b.title.localeCompare(a.title);
        case 'year':
          return a.publishingYear - b.publishingYear;
        case 'yearDesc':
          return b.publishingYear - a.publishingYear;
        case 'author':
          return (a.authorName || '').localeCompare(b.authorName || '');
        case 'availability':
          return b.availableCopies - a.availableCopies;
        default:
          return 0;
      }
    });

    return books;
  }, [booksResponse?.data, filters, sortBy]);

  // Paginate books
  const paginatedBooks = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedBooks.slice(startIndex, endIndex);
  }, [filteredAndSortedBooks, page, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedBooks.length / itemsPerPage);

  const canReset = Object.keys(filters).some(
    (key) =>
      filters[key as keyof BookFiltersProps] !== defaultFilters[key as keyof BookFiltersProps]
  );

  if (isLoading) {
    return (
      <DashboardContent>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (booksError) {
    return (
      <DashboardContent>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load books. Please try again later.
        </Alert>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
        <Typography variant="h4">Books ({filteredAndSortedBooks.length} total)</Typography>

        <Button
          variant="contained"
          onClick={() => setModalOpen(true)}
          startIcon={<Iconify icon="solar:pen-bold" />}
          sx={{ flexShrink: 0 }}
        >
          Add New Book
        </Button>
      </Box>

      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap-reverse',
          justifyContent: 'flex-end',
        }}
      >
        <Box
          sx={{
            my: 1,
            gap: 1,
            flexShrink: 0,
            display: 'flex',
          }}
        >
          <BookFilters
            canReset={canReset}
            filters={filters}
            onSetFilters={handleSetFilters}
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
            onResetFilter={() => setFilters(defaultFilters)}
            options={{
              categories: CATEGORY_OPTIONS,
              availability: AVAILABILITY_OPTIONS,
              years: YEAR_OPTIONS,
            }}
          />

          <BookSort
            sortBy={sortBy}
            onSort={handleSort}
            options={[
              { value: 'title', label: 'Title: A-Z' },
              { value: 'titleDesc', label: 'Title: Z-A' },
              { value: 'year', label: 'Year: Old-New' },
              { value: 'yearDesc', label: 'Year: New-Old' },
              { value: 'author', label: 'Author: A-Z' },
              { value: 'availability', label: 'Most Available' },
            ]}
          />
        </Box>
      </Box>

      {paginatedBooks.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No books found matching your criteria
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedBooks.map((book) => (
              <Grid key={book.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <BookItem
                  book={book}
                  onBookClick={() => handleBookClick(book)}
                  onBorrowClick={() => handleBorrowClick(book)}
                />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              sx={{ mt: 8, mx: 'auto', display: 'flex', justifyContent: 'center' }}
            />
          )}
        </>
      )}

      <BookModal
        open={modalOpen}
        onClose={handleCloseModal}
        book={null}
        authors={authorsResponse?.data || []}
        authorsLoading={authorsLoading}
        onSave={handleCreateBook}
        onDelete={selectedBook ? handleDeleteBook : undefined} // only available in edit mode
        isSubmitting={isSubmitting}
      />

      <BookModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        book={selectedBook} // null for create, book object for edit
        authors={authorsResponse?.data || []}
        authorsLoading={authorsLoading}
        onSave={handleSaveBook}
        onDelete={handleDeleteBook}
        isSubmitting={isSubmitting}
      />

      {/* Borrow Modal */}
      {selectedBook && (
        <BorrowModal
          open={borrowModalOpen}
          onClose={handleBorrowModalClose}
          book={selectedBook}
          members={membersResponse?.data || []}
          membersLoading={membersLoading}
          onSave={handleBorrowSave}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </DashboardContent>
  );
}
