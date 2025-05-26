import type { ButtonProps } from '@mui/material/Button';

import { useState, useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type BorrowedBooksSortProps = ButtonProps & {
  sortBy: string;
  onSort: (newSort: string) => void;
  options: { value: string; label: string }[];
};

export function BorrowedBooksSort({
  options,
  sortBy,
  onSort,
  sx,
  ...other
}: BorrowedBooksSortProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const currentOption = options.find((option) => option.value === sortBy);

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={handleOpenPopover}
        startIcon={<Iconify icon="solar:eye-bold" sx={{ width: 18, height: 18 }} />}
        endIcon={
          <Iconify
            icon={openPopover ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            sx={{
              ml: -0.5,
              width: 16,
              height: 16,
            }}
          />
        }
        sx={[
          {
            minWidth: 120,
            bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            border: (theme) => `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
            '&:hover': {
              bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.12),
              border: (theme) =>
                `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.24)}`,
            },
            px: 2,
            py: 1,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {currentOption?.label || 'Sort by'}
        </Typography>
      </Button>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              boxShadow: (theme) => theme.customShadows.dropdown,
            },
          },
        }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 200,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 2,
              py: 1,
              gap: 2,
              borderRadius: 0.75,
              typography: 'body2',
              [`&.${menuItemClasses.selected}`]: {
                bgcolor: 'primary.lighter',
                color: 'primary.main',
                fontWeight: 600,
              },
              '&:hover': {
                bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
              },
            },
          }}
        >
          {options.map((option) => {
            const isSelected = option.value === sortBy;

            return (
              <MenuItem
                key={option.value}
                selected={isSelected}
                onClick={() => {
                  onSort(option.value);
                  handleClosePopover();
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    width: '100%',
                  }}
                >
                  <Iconify
                    icon="carbon:chevron-sort"
                    sx={{
                      width: 18,
                      height: 18,
                      color: isSelected ? 'primary.main' : 'text.secondary',
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      flexGrow: 1,
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    {option.label}
                  </Typography>

                  {isSelected && (
                    <Iconify
                      icon="eva:checkmark-fill"
                      sx={{
                        width: 16,
                        height: 16,
                        color: 'primary.main',
                      }}
                    />
                  )}
                </Box>
              </MenuItem>
            );
          })}
        </MenuList>
      </Popover>
    </>
  );
}
