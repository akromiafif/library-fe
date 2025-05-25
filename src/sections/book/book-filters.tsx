import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export type FiltersProps = {
  category: string;
  availability: string;
  year: string;
  search: string;
};

type BookFiltersProps = {
  canReset: boolean;
  openFilter: boolean;
  filters: FiltersProps;
  onOpenFilter: () => void;
  onCloseFilter: () => void;
  onResetFilter: () => void;
  onSetFilters: (updateState: Partial<FiltersProps>) => void;
  options: {
    categories: { value: string; label: string }[];
    availability: { value: string; label: string }[];
    years: { value: string; label: string }[];
  };
};

export function BookFilters({
  filters,
  options,
  canReset,
  openFilter,
  onSetFilters,
  onOpenFilter,
  onCloseFilter,
  onResetFilter,
}: BookFiltersProps) {
  const renderSearch = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Search</Typography>
      <TextField
        fullWidth
        size="small"
        value={filters.search}
        onChange={(e) => onSetFilters({ search: e.target.value })}
        placeholder="Search books, authors..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
          endAdornment: filters.search && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => onSetFilters({ search: '' })} sx={{ p: 0.5 }}>
                <Iconify icon="solar:pen-bold" sx={{ width: 16, height: 16 }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );

  const renderCategory = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Category</Typography>
      <RadioGroup value={filters.category}>
        {options.categories.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <Radio
                checked={filters.category === option.value}
                onChange={() => onSetFilters({ category: option.value })}
              />
            }
            label={option.label}
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: '0.875rem',
              },
            }}
          />
        ))}
      </RadioGroup>
    </Stack>
  );

  const renderAvailability = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Availability</Typography>
      <RadioGroup value={filters.availability}>
        {options.availability.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <Radio
                checked={filters.availability === option.value}
                onChange={() => onSetFilters({ availability: option.value })}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {option.label}
                {option.value === 'available' && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                    }}
                  />
                )}
                {option.value === 'unavailable' && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'error.main',
                    }}
                  />
                )}
              </Box>
            }
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: '0.875rem',
              },
            }}
          />
        ))}
      </RadioGroup>
    </Stack>
  );

  const renderYear = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Publishing Year</Typography>
      <RadioGroup value={filters.year}>
        {options.years.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <Radio
                checked={filters.year === option.value}
                onChange={() => onSetFilters({ year: option.value })}
              />
            }
            label={option.label}
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: '0.875rem',
              },
            }}
          />
        ))}
      </RadioGroup>
    </Stack>
  );

  const activeFiltersCount = [
    filters.category !== 'all' ? 1 : 0,
    filters.availability !== 'all' ? 1 : 0,
    filters.year !== 'all' ? 1 : 0,
    filters.search ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0);

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={
          <Badge
            color="error"
            badgeContent={activeFiltersCount > 0 ? activeFiltersCount : null}
            variant={activeFiltersCount > 0 ? 'standard' : 'dot'}
            invisible={!canReset}
          >
            <Iconify icon="ic:round-filter-list" />
          </Badge>
        }
        onClick={onOpenFilter}
        sx={{
          color: canReset ? 'primary.main' : 'text.secondary',
          fontWeight: canReset ? 600 : 400,
        }}
      >
        Filters
        {activeFiltersCount > 0 && (
          <Typography variant="caption" sx={{ ml: 0.5 }}>
            ({activeFiltersCount})
          </Typography>
        )}
      </Button>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        slotProps={{
          paper: {
            sx: { width: 320, overflow: 'hidden' },
          },
        }}
      >
        <Box
          sx={{
            py: 2,
            pl: 2.5,
            pr: 1.5,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Filter Books
          </Typography>

          <IconButton
            onClick={onResetFilter}
            disabled={!canReset}
            sx={{
              color: canReset ? 'primary.main' : 'text.disabled',
            }}
          >
            <Badge color="error" variant="dot" invisible={!canReset}>
              <Iconify icon="solar:restart-bold" />
            </Badge>
          </IconButton>

          <IconButton onClick={onCloseFilter}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            {renderSearch}
            <Divider />
            {renderCategory}
            <Divider />
            {renderAvailability}
            <Divider />
            {renderYear}
          </Stack>
        </Scrollbar>

        {/* Footer with active filters summary */}
        {canReset && (
          <>
            <Divider />
            <Box sx={{ p: 2, bgcolor: 'background.neutral' }}>
              <Typography variant="caption" color="text.secondary">
                {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
              </Typography>
              <Button size="small" onClick={onResetFilter} sx={{ ml: 1, minWidth: 'auto', p: 0.5 }}>
                Clear all
              </Button>
            </Box>
          </>
        )}
      </Drawer>
    </>
  );
}
