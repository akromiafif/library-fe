import type { CardProps } from '@mui/material/Card';
import type { IconifyName } from 'src/components/iconify';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import { BorrowedBookDTO } from 'src/api/types/borrowed-book.type';

// ----------------------------------------------------------------------

export function BorrowedBookItem({
  sx,
  borrowedBook,
  latestPost,
  latestPostLarge,
  ...other
}: CardProps & {
  borrowedBook: BorrowedBookDTO;
  latestPost: boolean;
  latestPostLarge: boolean;
}) {
  // Calculate days until due
  const daysUntilDue = borrowedBook.dueDate
    ? Math.ceil(
        (new Date(borrowedBook.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  // Status color mapping
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

  // Generate cover URL based on book ID
  const coverUrl = `https://picsum.photos/400/600?random=${borrowedBook.bookId}`;

  // Generate member avatar URL based on member ID
  const memberAvatarUrl = `https://i.pravatar.cc/150?u=${borrowedBook.memberId}`;

  const renderAvatar = (
    <Avatar
      src={memberAvatarUrl}
      alt={borrowedBook.memberName}
      sx={{
        left: 24,
        zIndex: 9,
        bottom: -24,
        position: 'absolute',
        bgcolor: getStatusColor(borrowedBook.status) + '.main',
        ...((latestPostLarge || latestPost) && {
          top: 24,
        }),
      }}
    >
      {!memberAvatarUrl && (
        <Iconify
          // icon={getStatusIcon(borrowedBook.status)}
          icon="eva:trending-up-fill"
        />
      )}
    </Avatar>
  );

  const renderTitle = (
    <Link
      color="inherit"
      variant="subtitle2"
      underline="hover"
      sx={{
        height: 44,
        overflow: 'hidden',
        WebkitLineClamp: 2,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        ...(latestPostLarge && { typography: 'h5', height: 60 }),
        ...((latestPostLarge || latestPost) && {
          color: 'common.white',
        }),
      }}
    >
      {borrowedBook.bookTitle}
    </Link>
  );

  const renderAuthor = (
    <Typography
      variant="caption"
      component="div"
      sx={{
        mb: 1,
        color: 'text.disabled',
        fontStyle: 'italic',
        ...((latestPostLarge || latestPost) && {
          opacity: 0.48,
          color: 'common.white',
        }),
      }}
    >
      by {borrowedBook.authorName}
    </Typography>
  );

  const renderInfo = (
    <Box
      sx={{
        mt: 3,
        gap: 1.5,
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        color: 'text.disabled',
        justifyContent: 'flex-end',
      }}
    >
      {[
        {
          number: borrowedBook.memberName,
          icon: 'solar:user-bold',
          isText: true,
        },
        {
          number:
            daysUntilDue > 0
              ? `${daysUntilDue}d left`
              : daysUntilDue < 0
                ? `${Math.abs(daysUntilDue)}d overdue`
                : 'Due today',
          icon: 'solar:calendar-bold',
          isText: true,
          color:
            daysUntilDue < 0 ? 'error.main' : daysUntilDue === 0 ? 'warning.main' : 'text.disabled',
        },
        ...(borrowedBook.fineAmount > 0
          ? [
              {
                number: `$${borrowedBook.fineAmount.toFixed(2)}`,
                icon: 'solar:dollar-minimalistic-bold' as IconifyName,
                isText: true,
                color: 'error.main',
              },
            ]
          : []),
      ].map((info, _index) => (
        <Box
          key={_index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: info.color || 'text.disabled',
            ...((latestPostLarge || latestPost) && {
              opacity: 0.64,
              color: 'common.white',
            }),
          }}
        >
          <Iconify width={16} icon={info.icon as IconifyName} sx={{ mr: 0.5 }} />
          <Typography variant="caption">{info.number}</Typography>
        </Box>
      ))}
    </Box>
  );

  const renderCover = (
    <Box
      component="img"
      alt={borrowedBook.bookTitle}
      src={coverUrl}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
      onError={(e) => {
        // Fallback to a default book cover if image fails to load
        (e.target as HTMLImageElement).src = '/assets/images/covers/default-book.jpg';
      }}
    />
  );

  const renderDate = (
    <Typography
      variant="caption"
      component="div"
      sx={{
        mb: 1,
        color: 'text.disabled',
        ...((latestPostLarge || latestPost) && {
          opacity: 0.48,
          color: 'common.white',
        }),
      }}
    >
      Borrowed: {fDate(borrowedBook.borrowDate)}
    </Typography>
  );

  const renderStatus = (
    <Box sx={{ mb: 1 }}>
      <Chip
        label={borrowedBook.status}
        size="small"
        color={getStatusColor(borrowedBook.status) as any}
        icon={<Iconify icon="solar:check-circle-bold" width={16} />}
        sx={{
          ...((latestPostLarge || latestPost) && {
            color: 'common.white',
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            '& .MuiChip-icon': {
              color: 'common.white',
            },
          }),
        }}
      />
    </Box>
  );

  const renderShape = (
    <SvgColor
      src="/assets/icons/shape-avatar.svg"
      sx={{
        left: 0,
        width: 88,
        zIndex: 9,
        height: 36,
        bottom: -16,
        position: 'absolute',
        color: 'background.paper',
        ...((latestPostLarge || latestPost) && { display: 'none' }),
      }}
    />
  );

  return (
    <Card sx={sx} {...other}>
      <Box
        sx={(theme) => ({
          position: 'relative',
          pt: 'calc(100% * 3 / 4)',
          ...((latestPostLarge || latestPost) && {
            pt: 'calc(100% * 4 / 3)',
            '&:after': {
              top: 0,
              content: "''",
              width: '100%',
              height: '100%',
              position: 'absolute',
              bgcolor: varAlpha(theme.palette.grey['900Channel'], 0.72),
            },
          }),
          ...(latestPostLarge && {
            pt: {
              xs: 'calc(100% * 4 / 3)',
              sm: 'calc(100% * 3 / 4.66)',
            },
          }),
        })}
      >
        {renderShape}
        {renderAvatar}
        {renderCover}
      </Box>

      <Box
        sx={(theme) => ({
          p: theme.spacing(6, 3, 3, 3),
          ...((latestPostLarge || latestPost) && {
            width: 1,
            bottom: 0,
            position: 'absolute',
          }),
        })}
      >
        {renderDate}
        {renderStatus}
        {renderAuthor}
        {renderTitle}
        {renderInfo}
      </Box>
    </Card>
  );
}
