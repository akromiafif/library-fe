import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Typography } from '@mui/material';

export type MemberProps = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  membershipDate: string;
  status: string;
  borrowedCount: number;
};

type MemberTableRowProps = {
  row: MemberProps;
  selected: boolean;
  onDelete: () => void;
  onEdit: () => void;
};

export function UserTableRow({ row, selected, onDelete, onEdit }: MemberTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const handleOpenPopover = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(e.currentTarget);
  }, []);
  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'suspended':
        return 'warning';
      default:
        return 'error';
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell component="th" scope="row">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar>{row.name.charAt(0)}</Avatar>
            <Box>
              <Typography variant="body2">{row.name}</Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.phone}</TableCell>
        <TableCell>{row.address}</TableCell>
        <TableCell>{row.membershipDate}</TableCell>
        <TableCell>
          <Label color={getStatusClass(row.status)}>{row.status}</Label>
        </TableCell>
        <TableCell>{row.borrowedCount} books</TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={Boolean(openPopover)}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem
            onClick={() => {
              handleClosePopover();
              onEdit();
            }}
          >
            <Iconify icon="solar:pen-bold" /> Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClosePopover();
              onDelete();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" /> Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
