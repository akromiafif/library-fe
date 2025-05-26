// src/components/borrowed-book-edit-dialog.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import {
  BorrowedBookDTO,
  BorrowedBookUpdateRequest,
  BorrowStatus,
} from 'src/api/types/borrowed-book.type';

export function BorrowedBookEditDialog({
  open,
  borrowedBook,
  isLoading,
  onClose,
  onConfirm,
}: {
  open: boolean;
  borrowedBook: BorrowedBookDTO;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (updated: BorrowedBookUpdateRequest) => void;
}) {
  const [dueDate, setDueDate] = useState(borrowedBook.dueDate || '');
  const [status, setStatus] = useState(borrowedBook.status);

  useEffect(() => {
    if (open) {
      setDueDate(borrowedBook.dueDate || '');
      setStatus(borrowedBook.status);
    }
  }, [open, borrowedBook]);

  const handleSave = () => {
    onConfirm({
      id: borrowedBook.id || 0,
      dueDate,
      status,
      memberId: borrowedBook.memberId,
      bookId: borrowedBook.bookId,
      borrowDate: borrowedBook.borrowDate,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Edit Borrowed Book</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Due Date"
          type="date"
          fullWidth
          margin="normal"
          value={dueDate.slice(0, 10)}
          onChange={(e) => setDueDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Status"
          select
          fullWidth
          margin="normal"
          value={status}
          onChange={(e) => setStatus(e.target.value as BorrowStatus)}
        >
          {['BORROWED', 'OVERDUE', 'RETURNED', 'LOST'].map((s) => (
            <MenuItem key={s} value={s}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={isLoading}>
          {isLoading ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
