import { lazy, Suspense } from 'react';
import LoadingPage from '../pages/LoadingPage';

const Write1 = lazy(() => import('../pages/Write1'));
const Write2 = lazy(() => import('../pages/Write2'));
const Write3 = lazy(() => import('../pages/Write3'));

const writeRouter = () => {
  return [
    {
      path: '1',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <Write1 />
        </Suspense>
      ),
    },
    {
      path: '2',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <Write2 />
        </Suspense>
      ),
    },
    {
      path: '3',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <Write3 />
        </Suspense>
      ),
    },
  ];
};

export default writeRouter;
