import { lazy } from 'react';
import { IS_DEV } from '@/api/env';

const SubPageDevPage = lazy(() => import('@/pages/dev/SubPageDevPage'));

/** SubPageDevPage: 각 섹션 화면이 SubPageLayout으로 옮겨 가면 지움 */
export default IS_DEV
  ? [
      {
        layout: 'user',
        auth: 'public',
        routes: [
          { path: '/dev/sub-page', Component: SubPageDevPage },
        ],
      },
    ]
  : [];
