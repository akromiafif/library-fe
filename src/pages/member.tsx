import { CONFIG } from 'src/config-global';

import { MemberView } from 'src/sections/member/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Members - ${CONFIG.appName}`}</title>

      <MemberView />
    </>
  );
}
