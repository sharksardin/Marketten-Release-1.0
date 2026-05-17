import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import './App.css';
import { rootRouter } from './router/rootRouter';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

function App() {
  useEffect(() => {
    const token = getCookie('accessToken');

    if (token) {
      console.log(
        '소셜 로그인 토큰을 쿠키에서 발견하여 localStorage로 옮깁니다.'
      );
      localStorage.setItem('accessToken', token);

      document.cookie =
        'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      window.location.reload();
    }
  }, []);

  return <RouterProvider router={rootRouter} />;
}

export default App;
