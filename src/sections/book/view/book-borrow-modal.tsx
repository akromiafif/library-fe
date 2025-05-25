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
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';

import { Iconify } from 'src/components/iconify';
import { BookDTO } from 'src/api/types/book.types';

// ----------------------------------------------------------------------

// TypeScript interfaces based on the Java DTO
export interface BorrowedBookFormData {
  bookId: number;
  memberId: number | '';
  borrowDate: string; // ISO date string
  dueDate: string; // ISO date string
  notes: string;
}

interface Member {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  membershipType?: string;
}

interface BorrowModalProps {
  open: boolean;
  onClose: () => void;
  book: BookDTO;
  members: Member[];
  membersLoading: boolean;
  onSave: (data: BorrowedBookFormData) => Promise<void>;
  isSubmitting: boolean;
}

const getInitialFormData = (book: BookDTO): BorrowedBookFormData => {
  const today = new Date();
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 14); // Default 2 weeks borrowing period

  return {
    bookId: book.id,
    memberId: '',
    borrowDate: today.toISOString().split('T')[0], // Format: YYYY-MM-DD
    dueDate: dueDate.toISOString().split('T')[0],
    notes: '',
  };
};

export function BorrowModal({
  open,
  onClose,
  book,
  members,
  membersLoading,
  onSave,
  isSubmitting,
}: BorrowModalProps) {
  const [formData, setFormData] = useState<BorrowedBookFormData>(getInitialFormData(book));

  // Reset form when modal opens or book changes
  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData(book));
    }
  }, [open, book]);

  const handleFormChange = useCallback(
    (field: keyof BorrowedBookFormData, value: string | number) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleSave = useCallback(async () => {
    await onSave(formData);
  }, [onSave, formData]);

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      onClose();
    }
  }, [onClose, isSubmitting]);

  // Calculate borrowing period
  const borrowingDays = Math.ceil(
    (new Date(formData.dueDate).getTime() - new Date(formData.borrowDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // Form validation
  const isFormValid =
    formData.memberId &&
    formData.borrowDate &&
    formData.dueDate &&
    new Date(formData.dueDate) > new Date(formData.borrowDate);

  const selectedMember = members.find((member) => member.id === formData.memberId);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={isSubmitting}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:eye-bold" sx={{ color: 'primary.main' }} />
          <Typography variant="h6">Borrow Book</Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={isSubmitting}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Book Information Card */}
          <Card variant="outlined" sx={{ bgcolor: 'background.neutral' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  component="img"
                  src={`https://picsum.photos/120/180?random=${book.id}`}
                  alt={book.title}
                  sx={{
                    width: 60,
                    height: 90,
                    borderRadius: 1,
                    objectFit: 'cover',
                  }}
                />
                <Stack flex={1} spacing={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    by {book.authorName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip
                      label={book.category}
                      size="small"
                      color="primary"
                      sx={{ textTransform: 'capitalize' }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {book.availableCopies} of {book.totalCopies} available
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Divider />

          {/* Borrower Information */}
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify icon="solar:eye-bold" />
            Borrower Information
          </Typography>

          <TextField
            select
            fullWidth
            label="Select Member"
            value={formData.memberId}
            onChange={(e) => handleFormChange('memberId', parseInt(e.target.value, 10) || '')}
            required
            disabled={membersLoading}
            error={!formData.memberId}
            helperText={
              !formData.memberId
                ? 'Member selection is required'
                : selectedMember
                  ? `Email: ${selectedMember.email}`
                  : ''
            }
          >
            {members.map((member) => (
              <MenuItem key={member.id} value={member.id}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {member.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {member.email}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <Divider />

          {/* Borrowing Dates */}
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify icon="solar:eye-bold" />
            Borrowing Period
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Borrow Date"
              type="date"
              value={formData.borrowDate}
              onChange={(e) => handleFormChange('borrowDate', e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: new Date().toISOString().split('T')[0] }}
              error={!formData.borrowDate}
            />

            <TextField
              fullWidth
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleFormChange('dueDate', e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: formData.borrowDate }}
              error={
                !formData.dueDate || new Date(formData.dueDate) <= new Date(formData.borrowDate)
              }
              helperText={
                borrowingDays > 0
                  ? `${borrowingDays} days borrowing period`
                  : 'Due date must be after borrow date'
              }
            />
          </Stack>

          {/* Notes */}
          <TextField
            fullWidth
            label="Notes (Optional)"
            multiline
            rows={3}
            value={formData.notes}
            onChange={(e) => handleFormChange('notes', e.target.value)}
            placeholder="Add any special notes or conditions..."
            inputProps={{ maxLength: 500 }}
            helperText={`${formData.notes.length}/500 characters`}
          />

          {/* Summary Card */}
          <Card variant="outlined" sx={{ bgcolor: 'primary.lighter' }}>
            <CardContent>
              <Typography variant="subtitle2" color="primary.main" gutterBottom>
                Borrowing Summary
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Book:</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {book.title}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Member:</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {selectedMember?.name || 'Please select member'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Period:</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {borrowingDays > 0 ? `${borrowingDays} days` : 'Invalid dates'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Status:</Typography>
                  <Chip label="BORROWED" size="small" color="success" variant="outlined" />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button onClick={handleClose} disabled={isSubmitting} color="inherit">
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSubmitting || !isFormValid}
          startIcon={
            isSubmitting ? <CircularProgress size={16} /> : <Iconify icon="solar:pen-bold" />
          }
          sx={{ minWidth: 120 }}
        >
          {isSubmitting ? 'Processing...' : 'Borrow Book'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
