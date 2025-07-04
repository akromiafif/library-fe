import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const UserPage = lazy(() => import('src/pages/user'));
export const MemberPage = lazy(() => import('src/pages/member'));
export const BooksPage = lazy(() => import('src/pages/books'));
export const BorrwedBooksPage = lazy(() => import('src/pages/borrowed-books'));

const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export const routesSection: RouteObject[] = [
  {
    element: (
      <DashboardLayout>
        <Suspense fallback={renderFallback()}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { index: true, element: <BooksPage /> },
      { path: 'author', element: <UserPage /> },
      { path: 'member', element: <MemberPage /> },
      { path: 'borrowed-books', element: <BorrwedBooksPage /> },
    ],
  },
];
