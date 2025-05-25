import { CONFIG } from 'src/config-global';

import { UserView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Authors - ${CONFIG.appName}`}</title>

      <UserView />
    </>
  );
}
