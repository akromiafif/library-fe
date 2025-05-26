import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Iconify } from 'src/components/iconify';
import { BorrowedBookDTO } from 'src/api/types/borrowed-book.type';

interface DeleteBorrowedBookDialogProps {
  open: boolean;
  onClose: () => void;
  borrowedBook: BorrowedBookDTO | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteBorrowedBookDialog({
  open,
  onClose,
  borrowedBook,
  onConfirm,
  isLoading = false,
}: DeleteBorrowedBookDialogProps) {
  if (!borrowedBook) return null;

  const isOverdue = borrowedBook.status === 'OVERDUE';
  const hasFine = borrowedBook.fineAmount > 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:eye-bold" color="error.main" />
          Delete Borrowed Book Record
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to delete this borrowed book record?
        </Typography>

        <Box
          sx={{
            p: 2,
            borderRadius: 1,
            bgcolor: 'grey.50',
            border: '1px solid',
            borderColor: 'grey.200',
            mb: 2,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {borrowedBook.bookTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            by {borrowedBook.authorName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Borrowed by: {borrowedBook.memberName}
          </Typography>
        </Box>

        {isOverdue && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            This book is currently overdue. Deleting this record will not automatically return the
            book to the library.
          </Alert>
        )}

        {hasFine && (
          <Alert severity="error" sx={{ mb: 2 }}>
            This record has an outstanding fine of ${borrowedBook.fineAmount.toFixed(2)}. Make sure
            to collect the fine before deleting this record.
          </Alert>
        )}

        <Alert severity="info">
          <Typography variant="body2">
            <strong>Note:</strong> This action cannot be undone. The borrowed book record will be
            permanently removed from the system.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <LoadingButton
          onClick={onConfirm}
          loading={isLoading}
          variant="contained"
          color="error"
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Delete Record
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
