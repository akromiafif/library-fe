import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { useTable } from 'src/hooks/useTable';
import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import {
  useAuthors,
  useDeleteAuthor,
  useUpdateAuthor,
  useCreateAuthor,
} from 'src/api/hooks/authorQueries';
import type { AuthorDTO, AuthorCreateRequest } from 'src/api/types/author.types';
import { TableEmptyRows } from '../table-empty-rows';

export function UserView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');

  const { data, isLoading, error } = useAuthors();
  const deleteMutation = useDeleteAuthor({ onError: (err) => console.error('Delete failed', err) });
  const updateMutation = useUpdateAuthor({ onError: (err) => console.error('Update failed', err) });
  const createMutation = useCreateAuthor({ onError: (err) => console.error('Create failed', err) });

  const authors = data?.data ?? [];
  const STATUSES = ['active', 'banned'] as const;

  // Edit modal state
  const [editingAuthor, setEditingAuthor] = useState<AuthorDTO | null>(null);
  const [formValues, setFormValues] = useState({ name: '', nationality: '', biography: '' });

  // Create modal state
  const [creating, setCreating] = useState(false);
  const [createValues, setCreateValues] = useState<AuthorCreateRequest>({
    name: '',
    nationality: '',
    biography: '',
  });

  const rows = authors.map((author, index) => ({
    id: author.id.toString(),
    name: author.name,
    nationality: author.nationality,
    biography: author.biography || '—',
    // isVerified: Math.random() < 0.5,
    // status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    isVerified: true,
    status: 'active',
    avatarUrl: `/assets/images/avatar/avatar-${index + 1}.webp`,
    books: author.books?.length ?? 0,
  }));

  const dataFiltered = applyFilter({
    inputData: rows,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });
  const notFound = !dataFiltered.length && !!filterName;

  const handleDelete = (id: string) => {
    deleteMutation.mutate(Number(id));
  };

  const handleOpenEdit = (id: string) => {
    const author = authors.find((a) => a.id.toString() === id);
    if (author) {
      setEditingAuthor(author);
      setFormValues({
        name: author.name,
        nationality: author.nationality,
        biography: author.biography || '',
      });
    }
  };

  const handleCloseEdit = () => setEditingAuthor(null);

  const handleFormChange =
    (field: keyof typeof formValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormValues((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSaveEdit = () => {
    if (editingAuthor) {
      updateMutation.mutate(
        { id: editingAuthor.id, authorData: formValues },
        { onSuccess: () => handleCloseEdit() }
      );
    }
  };

  const handleOpenCreate = () => {
    setCreating(true);
    setCreateValues({ name: '', nationality: '', biography: '' });
  };

  const handleCloseCreate = () => setCreating(false);

  const handleCreateChange =
    (field: keyof AuthorCreateRequest) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setCreateValues((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSaveCreate = () => {
    createMutation.mutate({ ...createValues, books: [] }, { onSuccess: () => handleCloseCreate() });
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Authors
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenCreate}
        >
          New user
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(e) => {
            setFilterName(e.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            {isLoading ? (
              <Typography sx={{ p: 2 }}>Loading authors…</Typography>
            ) : error ? (
              <Typography color="error" sx={{ p: 2 }}>
                Failed to load authors
              </Typography>
            ) : (
              <Table sx={{ minWidth: 800 }}>
                <UserTableHead
                  order={table.order}
                  orderBy={table.orderBy}
                  rowCount={rows.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      rows.map((r) => r.id)
                    )
                  }
                  headLabel={[
                    { id: 'name', label: 'Name' },
                    { id: 'nationality', label: 'Nationality' },
                    { id: 'biography', label: 'Biography' },
                    { id: 'books', label: 'Total Books' },
                    { id: 'isVerified', label: 'Verified', align: 'center' },
                    { id: 'status', label: 'Status' },
                    { id: '' },
                  ]}
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDelete={() => handleDelete(row.id)}
                        onEdit={() => handleOpenEdit(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={68}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, rows.length)}
                  />
                  {notFound && <TableNoData searchQuery={filterName} />}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Scrollbar>

        {!isLoading && !error && (
          <TablePagination
            component="div"
            page={table.page}
            count={rows.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        )}
      </Card>

      {/* Create Author Dialog */}
      <Dialog open={creating} onClose={handleCloseCreate} fullWidth maxWidth="sm">
        <DialogTitle>Create Author</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="normal"
            label="Name"
            fullWidth
            value={createValues.name}
            onChange={handleCreateChange('name')}
          />
          <TextField
            margin="normal"
            label="Nationality"
            fullWidth
            value={createValues.nationality}
            onChange={handleCreateChange('nationality')}
          />
          <TextField
            margin="normal"
            label="Biography"
            fullWidth
            multiline
            rows={4}
            value={createValues.biography}
            onChange={handleCreateChange('biography')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreate}>Cancel</Button>
          <Button onClick={handleSaveCreate} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Author Dialog */}
      <Dialog open={Boolean(editingAuthor)} onClose={handleCloseEdit} fullWidth maxWidth="sm">
        <DialogTitle>Edit Author</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="normal"
            label="Name"
            fullWidth
            value={formValues.name}
            onChange={handleFormChange('name')}
          />
          <TextField
            margin="normal"
            label="Nationality"
            fullWidth
            value={formValues.nationality}
            onChange={handleFormChange('nationality')}
          />
          <TextField
            margin="normal"
            label="Biography"
            fullWidth
            multiline
            rows={4}
            value={formValues.biography}
            onChange={handleFormChange('biography')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
