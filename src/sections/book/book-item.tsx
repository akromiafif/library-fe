import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { BookDTO } from 'src/api/types/book.types';

// ----------------------------------------------------------------------

export function BookItem({
  book,
  onBookClick,
  onBorrowClick,
}: {
  book: BookDTO;
  onBookClick?: () => void;
  onBorrowClick?: () => void;
}) {
  // Generate a placeholder image URL (keeping the product image concept)
  const coverUrl = `https://picsum.photos/400/600?random=${book.id}`;

  // Determine availability status
  const isAvailable = book.availableCopies > 0;
  const isLowStock = book.availableCopies > 0 && book.availableCopies <= 2;
  const isOutOfStock = book.availableCopies === 0;

  const renderStatus = (
    <Label
      variant="inverted"
      color={isOutOfStock ? 'error' : isLowStock ? 'warning' : 'success'}
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'Available'}
    </Label>
  );

  const renderImg = (
    <Box
      component="img"
      alt={book.title}
      src={coverUrl}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderCopiesInfo = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Tooltip title={`${book.availableCopies} available out of ${book.totalCopies} total copies`}>
        <Chip
          size="small"
          label={`${book.availableCopies}/${book.totalCopies}`}
          color={isOutOfStock ? 'error' : isLowStock ? 'warning' : 'success'}
          variant="outlined"
          sx={{ minWidth: 60 }}
        />
      </Tooltip>
    </Box>
  );

  const renderYear = (
    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
      {book.publishingYear}
    </Typography>
  );

  const renderBorrowButton = (
    <Button
      variant="contained"
      size="small"
      fullWidth
      disabled={isOutOfStock}
      onClick={(e) => {
        e.stopPropagation(); // Prevent card click when button is clicked
        onBorrowClick?.();
      }}
      startIcon={<Iconify icon="solar:pen-bold" />}
      sx={{
        mt: 1,
        backgroundColor: isOutOfStock ? 'grey.400' : 'primary.main',
        '&:hover': {
          backgroundColor: isOutOfStock ? 'grey.400' : 'primary.dark',
        },
      }}
    >
      {isOutOfStock ? 'Out of Stock' : 'Borrow Book'}
    </Button>
  );

  return (
    <Card
      sx={{
        cursor: onBookClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onBookClick
          ? {
              transform: 'translateY(-4px)',
              boxShadow: (theme) => theme.shadows[8],
            }
          : {},
      }}
      onClick={onBookClick}
    >
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {renderStatus}
        {renderImg}
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        {/* Book Title */}
        <Tooltip title={book.title} placement="top">
          <Link
            color="inherit"
            underline="hover"
            variant="subtitle2"
            noWrap
            sx={{ cursor: 'pointer' }}
          >
            {book.title}
          </Link>
        </Tooltip>

        {/* Author Name */}
        {book.authorName && (
          <Typography variant="body2" color="text.secondary" noWrap sx={{ fontStyle: 'italic' }}>
            by {book.authorName}
          </Typography>
        )}

        {/* Category */}
        <Chip
          label={book.category}
          size="small"
          color="primary"
          sx={{
            alignSelf: 'flex-start',
            textTransform: 'capitalize',
            fontSize: '0.75rem',
          }}
        />

        {/* Bottom row with copies info and year */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {renderCopiesInfo}
          {renderYear}
        </Box>

        {/* Additional info row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Total: {book.totalCopies} copies
          </Typography>

          {book.isbn && (
            <Tooltip title={`ISBN: ${book.isbn}`}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontFamily: 'monospace',
                  cursor: 'help',
                }}
              >
                ISBN
              </Typography>
            </Tooltip>
          )}
        </Box>

        {/* Borrow Button */}
        {renderBorrowButton}
      </Stack>
    </Card>
  );
}
