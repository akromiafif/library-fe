import { _posts } from 'src/_mock';
import { CONFIG } from 'src/config-global';

import { BorrowedBooksView } from 'src/sections/borrowed-book/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Borrowed Books - ${CONFIG.appName}`}</title>

      <BorrowedBooksView />
    </>
  );
}
