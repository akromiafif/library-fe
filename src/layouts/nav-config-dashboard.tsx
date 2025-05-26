import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Author',
    path: '/author',
    icon: icon('ic-user'),
  },
  {
    title: 'Member',
    path: '/member',
    icon: icon('ic-user'),
  },
  {
    title: 'Borrowed Books',
    path: '/borrowed-books',
    icon: icon('ic-book'),
  },
];
