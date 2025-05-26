import type { Theme, SxProps } from '@mui/material/styles';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

import { Iconify } from 'src/components/iconify';
import { BorrowedBookDTO } from 'src/api/types/borrowed-book.type';

// ----------------------------------------------------------------------

type BorrowedBooksSearchProps = {
  borrowedBooks: BorrowedBookDTO[];
  onSearch: (query: string) => void;
  sx?: SxProps<Theme>;
};

export function BorrowedBooksSearch({ borrowedBooks, onSearch, sx }: BorrowedBooksSearchProps) {
  // Transform borrowed books for search options
  const searchOptions = borrowedBooks.map((book) => ({
    id: book.id,
    label: book.bookTitle,
    subtitle: `by ${book.authorName}`,
    member: book.memberName,
    status: book.status,
    coverUrl: `/assets/images/covers/cover-${(book.bookId % 24) + 1}.jpg`,
    type: 'book' as const,
  }));

  // Add unique members as search options
  const uniqueMembers = Array.from(
    new Map(
      borrowedBooks.map((book) => [
        book.memberId,
        {
          id: `member-${book.memberId}`,
          label: book.memberName,
          subtitle: book.memberEmail,
          status: '',
          coverUrl: `/assets/icons/avatar_${(book.memberId % 24) + 1}.jpg`,
          type: 'member' as const,
        },
      ])
    ).values()
  );

  // Add unique authors as search options
  const uniqueAuthors = Array.from(new Set(borrowedBooks.map((book) => book.authorName))).map(
    (author) => ({
      id: `author-${author}`,
      label: author,
      subtitle: 'Author',
      status: '',
      coverUrl: '/assets/icons/ic-author.svg',
      type: 'author' as const,
    })
  );

  const allOptions = [...searchOptions, ...uniqueMembers, ...uniqueAuthors];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BORROWED':
        return 'primary';
      case 'OVERDUE':
        return 'error';
      case 'RETURNED':
        return 'success';
      case 'LOST':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Autocomplete
      sx={{ width: 400 }}
      autoHighlight
      popupIcon={null}
      freeSolo
      slotProps={{
        paper: {
          sx: {
            width: 400,
            [`& .${autocompleteClasses.option}`]: {
              typography: 'body2',
            },
            ...sx,
          },
        },
      }}
      options={allOptions}
      isOptionEqualToValue={(option, value) =>
        typeof option === 'string' || typeof value === 'string'
          ? option === value
          : option.id === value.id
      }
      onInputChange={(_, value) => {
        onSearch(value);
      }}
      renderOption={(props, option) => {
        if (typeof option === 'string') {
          return (
            <Box component="li" {...props}>
              {option}
            </Box>
          );
        }

        return (
          <Box component="li" {...props}>
            <Avatar
              src={option.coverUrl}
              sx={{
                width: 40,
                height: 40,
                mr: 2,
                ...(option.type === 'book' && {
                  borderRadius: 1,
                }),
              }}
            >
              {option.type === 'author' && <Iconify icon="mingcute:add-line" />}
            </Avatar>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2" noWrap>
                {option.label}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {option.subtitle}
              </Typography>
            </Box>

            {option.status && (
              <Chip
                label={option.status}
                size="small"
                color={getStatusColor(option.status) as any}
                sx={{ ml: 1 }}
              />
            )}

            <Box sx={{ ml: 1, color: 'text.disabled' }}>
              <Iconify icon="custom:menu-duotone" width={16} height={16} />
            </Box>
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search books, members, or authors..."
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    />
  );
}
