import { CONFIG } from 'src/config-global';

import { BooksView } from 'src/sections/book/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Books - ${CONFIG.appName}`}</title>

      <BooksView />
    </>
  );
}
