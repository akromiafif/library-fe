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
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableHead } from '../user-table-head';
import { UserTableRow } from '../user-table-row';

import {
  useMembers,
  useDeleteMember,
  useUpdateMember,
  useCreateMember,
} from 'src/api/hooks/memberQueries';
import type { MemberDTO, MemberCreateRequest } from 'src/api/types/member.types';
import { UserTableToolbar } from '../user-table-toolbar';
import { applyFilter, emptyRows, getComparator } from '../utils';

export function MemberView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');

  const { data, isLoading, error } = useMembers();
  const deleteMutation = useDeleteMember({ onError: (err) => console.error('Delete failed', err) });
  const updateMutation = useUpdateMember({ onError: (err) => console.error('Update failed', err) });
  const createMutation = useCreateMember({ onError: (err) => console.error('Create failed', err) });

  const members = data?.data ?? [];

  // Edit modal state
  const [editingMember, setEditingMember] = useState<MemberDTO | null>(null);
  const [formValues, setFormValues] = useState<Partial<MemberCreateRequest>>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Create modal state
  const [creating, setCreating] = useState(false);
  const [createValues, setCreateValues] = useState<MemberCreateRequest>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const rows = members.map((member) => ({
    id: member.id.toString(),
    name: member.name,
    email: member.email,
    phone: member.phone || '–',
    address: member.address || '–',
    membershipDate: member.membershipDate?.split('T')[0] || '–',
    status: member.membershipStatus?.toLowerCase() || 'active',
    borrowedCount: member.borrowedBooks?.length ?? 0,
  }));

  console.log({ members });

  const dataFiltered = applyFilter({
    inputData: rows,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });
  const notFound = !dataFiltered.length && !!filterName;

  const handleDelete = (id: string) => deleteMutation.mutate(Number(id));

  const handleOpenEdit = (id: string) => {
    const member = members.find((m) => m.id.toString() === id);
    if (member) {
      setEditingMember(member);
      setFormValues({
        name: member.name,
        email: member.email,
        phone: member.phone || '',
        address: member.address || '',
      });
    }
  };
  const handleCloseEdit = () => setEditingMember(null);

  const handleFormChange =
    (field: keyof MemberCreateRequest) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormValues((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSaveEdit = () => {
    if (editingMember) {
      updateMutation.mutate(
        { id: editingMember.id, memberData: formValues as MemberCreateRequest },
        { onSuccess: () => handleCloseEdit() }
      );
    }
  };

  const handleOpenCreate = () => {
    setCreating(true);
    setCreateValues({ name: '', email: '', phone: '', address: '' });
  };
  const handleCloseCreate = () => setCreating(false);
  const handleCreateChange =
    (field: keyof MemberCreateRequest) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setCreateValues((prev) => ({
        ...prev,
        status: 'ACTIVE',
        membershipDate: new Date().toISOString(),
        [field]: e.target.value,
      }));
  const handleSaveCreate = () =>
    createMutation.mutate(createValues, { onSuccess: () => handleCloseCreate() });

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Members
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenCreate}
        >
          New Member
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
              <Typography sx={{ p: 2 }}>Loading members…</Typography>
            ) : error ? (
              <Typography color="error" sx={{ p: 2 }}>
                Failed to load members
              </Typography>
            ) : (
              <Table sx={{ minWidth: 900 }}>
                <UserTableHead
                  order={table.order}
                  orderBy={table.orderBy}
                  onSort={table.onSort}
                  headLabel={[
                    { id: 'name', label: 'Name' },
                    { id: 'email', label: 'Email' },
                    { id: 'phone', label: 'Phone' },
                    { id: 'address', label: 'Address' },
                    { id: 'membershipDate', label: 'Member Since' },
                    { id: 'status', label: 'Status' },
                    { id: 'borrowedCount', label: 'Borrowed' },
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

      {/* Create Member Dialog */}
      <Dialog open={creating} onClose={handleCloseCreate} fullWidth maxWidth="sm">
        <DialogTitle>Create Member</DialogTitle>
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
            label="Email"
            fullWidth
            value={createValues.email}
            onChange={handleCreateChange('email')}
          />
          <TextField
            margin="normal"
            label="Phone"
            fullWidth
            value={createValues.phone}
            onChange={handleCreateChange('phone')}
          />
          <TextField
            margin="normal"
            label="Address"
            fullWidth
            value={createValues.address}
            onChange={handleCreateChange('address')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreate}>Cancel</Button>
          <Button onClick={handleSaveCreate} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={Boolean(editingMember)} onClose={handleCloseEdit} fullWidth maxWidth="sm">
        <DialogTitle>Edit Member</DialogTitle>
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
            label="Email"
            fullWidth
            value={formValues.email}
            onChange={handleFormChange('email')}
          />
          <TextField
            margin="normal"
            label="Phone"
            fullWidth
            value={formValues.phone}
            onChange={handleFormChange('phone')}
          />
          <TextField
            margin="normal"
            label="Address"
            fullWidth
            value={formValues.address}
            onChange={handleFormChange('address')}
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
