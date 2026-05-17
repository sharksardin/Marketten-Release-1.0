import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthRedirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');

    if (accessToken) {
      console.log(accessToken);
      localStorage.setItem('accessToken', accessToken);

      // JWT에서 이메일 추출
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const email = payload.email;
      localStorage.setItem('email', email); // ← 이메일 저장

      navigate('/'); // 로그인 후 이동할 페이지
    } else {
      navigate('/login'); // 실패 시 로그인 페이지로
    }
  }, [searchParams, navigate]);
  return <div>로그인 처리 중입니다...</div>;
};

export default AuthRedirect;
