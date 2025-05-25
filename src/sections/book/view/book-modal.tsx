import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { BookDTO } from 'src/api/types/book.types';

// ----------------------------------------------------------------------

const CATEGORY_OPTIONS = [
  { value: 'fiction', label: 'Fiction' },
  { value: 'non-fiction', label: 'Non-Fiction' },
  { value: 'science', label: 'Science' },
  { value: 'technology', label: 'Technology' },
  { value: 'history', label: 'History' },
  { value: 'biography', label: 'Biography' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'romance', label: 'Romance' },
];

export interface BookFormData {
  title: string;
  category: string;
  publishingYear: number;
  isbn: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  authorId: number;
}

interface Author {
  id: number;
  name: string;
}

interface BookModalProps {
  open: boolean;
  onClose: () => void;
  book?: BookDTO | null; // If provided, it's edit mode; if null/undefined, it's create mode
  authors: Author[];
  authorsLoading: boolean;
  onSave: (data: BookFormData) => Promise<void>;
  onDelete?: () => Promise<void>; // Only available in edit mode
  isSubmitting: boolean;
}

const getInitialFormData = (book?: BookDTO | null): BookFormData => ({
  title: book?.title || '',
  category: book?.category || CATEGORY_OPTIONS[0].value,
  publishingYear: book?.publishingYear || new Date().getFullYear(),
  isbn: book?.isbn || '',
  description: book?.description || '',
  totalCopies: book?.totalCopies || 1,
  availableCopies: book?.availableCopies || 1,
  authorId: book?.authorId || 0,
});

export function BookModal({
  open,
  onClose,
  book,
  authors,
  authorsLoading,
  onSave,
  onDelete,
  isSubmitting,
}: BookModalProps) {
  const [formData, setFormData] = useState<BookFormData>(getInitialFormData(book));
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEditMode = !!book;
  const modalTitle = isEditMode ? `Edit Book: ${book.title}` : 'Create New Book';

  // Reset form when modal opens/closes or book changes
  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData(book));
      setShowDeleteConfirm(false);
    }
  }, [open, book]);

  const handleFormChange = useCallback((field: keyof BookFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSave = useCallback(async () => {
    await onSave(formData);
  }, [onSave, formData]);

  const handleDelete = useCallback(async () => {
    if (onDelete) {
      await onDelete();
    }
  }, [onDelete]);

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      onClose();
    }
  }, [onClose, isSubmitting]);

  // Form validation
  const isFormValid =
    formData.title.trim() &&
    formData.authorId &&
    formData.totalCopies >= 1 &&
    formData.availableCopies >= 0 &&
    formData.availableCopies <= formData.totalCopies;

  const selectedAuthor = authors.find((author) => author.id === formData.authorId);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={isSubmitting}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">{modalTitle}</Typography>
        <IconButton onClick={handleClose} size="small" disabled={isSubmitting}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label="Book Title"
            value={formData.title}
            onChange={(e) => handleFormChange('title', e.target.value)}
            required
            error={!formData.title.trim()}
            helperText={!formData.title.trim() ? 'Title is required' : ''}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              select
              fullWidth
              label="Author"
              value={formData.authorId}
              onChange={(e) => handleFormChange('authorId', parseInt(e.target.value, 10) || '')}
              required
              disabled={authorsLoading}
              error={!formData.authorId}
              helperText={
                !formData.authorId
                  ? 'Author is required'
                  : selectedAuthor
                    ? `Selected: ${selectedAuthor.name}`
                    : ''
              }
            >
              {authors.map((author) => (
                <MenuItem key={author.id} value={author.id}>
                  {author.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Category"
              value={formData.category}
              onChange={(e) => handleFormChange('category', e.target.value)}
              required
            >
              {CATEGORY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Publishing Year"
              type="number"
              value={formData.publishingYear}
              onChange={(e) =>
                handleFormChange(
                  'publishingYear',
                  parseInt(e.target.value) || new Date().getFullYear()
                )
              }
              inputProps={{ min: 1000, max: new Date().getFullYear() + 1 }}
              required
            />

            <TextField
              fullWidth
              label="ISBN"
              value={formData.isbn}
              onChange={(e) => handleFormChange('isbn', e.target.value)}
              placeholder="Optional (e.g., 978-0-123456-78-9)"
            />
          </Stack>

          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => handleFormChange('description', e.target.value)}
            placeholder="Optional book description..."
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Total Copies"
              type="number"
              value={formData.totalCopies}
              onChange={(e) => handleFormChange('totalCopies', parseInt(e.target.value) || 1)}
              inputProps={{ min: 1 }}
              required
              error={formData.totalCopies < 1}
              helperText={formData.totalCopies < 1 ? 'Must be at least 1' : ''}
            />

            <TextField
              fullWidth
              label="Available Copies"
              type="number"
              value={formData.availableCopies}
              onChange={(e) => handleFormChange('availableCopies', parseInt(e.target.value) || 0)}
              inputProps={{ min: 0, max: formData.totalCopies }}
              required
              error={
                formData.availableCopies < 0 || formData.availableCopies > formData.totalCopies
              }
              helperText={
                formData.availableCopies < 0
                  ? 'Cannot be negative'
                  : formData.availableCopies > formData.totalCopies
                    ? `Cannot exceed total copies (${formData.totalCopies})`
                    : `Max: ${formData.totalCopies}`
              }
            />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        {/* Delete Button (only in edit mode) */}
        {isEditMode && onDelete && (
          <>
            {!showDeleteConfirm ? (
              <Button
                variant="outlined"
                color="error"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting}
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              >
                Delete Book
              </Button>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress size={16} />
                    ) : (
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    )
                  }
                  size="small"
                >
                  {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isSubmitting}
                  size="small"
                >
                  Cancel
                </Button>
              </Stack>
            )}
          </>
        )}

        <Box sx={{ flex: 1 }} />

        {/* Cancel and Save buttons */}
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSubmitting || !isFormValid}
          startIcon={
            isSubmitting ? (
              <CircularProgress size={16} />
            ) : (
              <Iconify icon={isEditMode ? 'solar:eye-bold' : 'solar:pen-bold'} />
            )
          }
        >
          {isSubmitting
            ? isEditMode
              ? 'Saving...'
              : 'Creating...'
            : isEditMode
              ? 'Save Changes'
              : 'Create Book'}
        </Button>
      </DialogActions>

      {showDeleteConfirm && (
        <Box
          sx={{ p: 2, bgcolor: 'error.lighter', borderTop: '1px solid', borderColor: 'divider' }}
        >
          <Typography variant="body2" color="error.main" align="center">
            Are you sure you want to delete &ldquo;{book?.title}&ldquo;? This action cannot be
            undone.
          </Typography>
        </Box>
      )}
    </Dialog>
  );
}
