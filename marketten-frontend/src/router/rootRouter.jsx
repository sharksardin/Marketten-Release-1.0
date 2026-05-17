import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoadingPage from '../pages/LoadingPage';
import writeRouter from './writeRouter';

import SocialLoginInitiator from './SocialLoginInitiator.jsx';

const Main = lazy(() => import('../pages/MainPage'));
const Details = lazy(() => import('../pages/Details'));
const Login = lazy(() => import('../pages/LoginPage'));
const Register = lazy(() => import('../pages/RegisterPage'));
const FindPassword = lazy(() => import('../pages/FindPasswordPage'));
const Manager = lazy(() => import('../pages/ManagerPage'));
const Storage = lazy(() => import('../pages/StoragePage'));
const MyPage = lazy(() => import('../pages/MyPage'));
const AuthRedirect = lazy(() => import('../pages/AuthRedirect'));
const Menu = lazy(() => import('../pages/MenuPage'));
export const rootRouter = createBrowserRouter([
  {
    path: '',
    element: (
      <Suspense fallback={<LoadingPage />}>
        <Main />
      </Suspense>
    ),
  },
  {
    path: 'auth/redirect',
    element: (
      <Suspense fallback={<LoadingPage />}>
        <AuthRedirect />
      </Suspense>
    ),
  },
  {
    path: 'social-login/:provider', // <--- 이 라우트를 추가합니다.
    element: (
      <Suspense fallback={<LoadingPage />}>
        <SocialLoginInitiator />
      </Suspense>
    ),
  },
  {
    path: 'write',

    children: writeRouter(),
  },
  {
    path: 'details',
    element: (
      <Suspense fallback={<LoadingPage />}>
        <Details />
      </Suspense>
    ),
  },
  {
    path: 'login',
    element: (
      <Suspense fallback={<LoadingPage />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: 'menu',
    element: (
      <Suspense fallback={<LoadingPage />}>
        <Menu />
      </Suspense>
    ),
  },
  {
    path: 'register',
    element: (
      <Suspense fallback={<LoadingPage />}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: 'findpassword',
    element: (
      <Suspense fallback={<LoadingPage />}>
        <FindPassword />
      </Suspense>
    ),
  },
  {
    path: 'manager',
    element: (
      <Suspense fallback={<LoadingPage />}>
        <Manager />
      </Suspense>
    ),
  },
  {
    path: 'storage',
    element: (
      <Suspense fallback={<LoadingPage />}>
        <Storage />
      </Suspense>
    ),
  },
  {
    path: 'mypage',
    element: (
      <Suspense fallback={<LoadingPage />}>
        <MyPage />
      </Suspense>
    ),
  },
]);
