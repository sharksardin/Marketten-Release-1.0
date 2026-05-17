import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BasicLayout from '../layout/BasicLayout';
import naverIcon from '../assets/naver_icon.png';
import { login } from '../api/loginApi';
import { LOGO_URL } from '../assets/Logo_Url';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/');
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const tokenInfo = await login(form);
      localStorage.setItem('accessToken', tokenInfo.accessToken);
      localStorage.setItem('refreshToken', tokenInfo.refreshToken);
      localStorage.setItem('email', tokenInfo.email);
      localStorage.setItem('needsOnboarding', tokenInfo.needsOnboarding);
      const userRole = tokenInfo.user.role;
      if (userRole === 'ADMIN') {
        window.location.href = '/';
      } else {
        if (tokenInfo.needsOnboarding) {
          alert(
            'Marketten에 오신 것을 환영합니다! 간단한 사용법을 안내해 드릴게요.'
          );
          window.location.href = '/write/1?tour=true';
        } else {
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      const errorMessage =
        error.response?.data?.message || '로그인에 실패했습니다.';
      alert(errorMessage);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <BasicLayout>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img className="mx-auto h-24 w-auto" src={LOGO_URL} alt="Marketten" />
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            {/* 입력 폼 */}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  이메일
                </label>
                <div className="mt-2">
                  {/* ✨ className에 px-3을 추가하여 좌우 여백을 줍니다. */}
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  비밀번호
                </label>
                <div className="mt-2">
                  {/* ✨ className에 px-3을 추가하여 좌우 여백을 줍니다. */}
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm leading-6 text-gray-900"
                  >
                    로그인 상태 유지
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleLogin}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  로그인
                </button>
                <div className="mt-4 flex justify-center items-center text-sm">
                  <Link
                    to="/register"
                    className="font-medium text-gray-700 hover:text-indigo-600 pr-3 border-r border-gray-300"
                  >
                    회원가입
                  </Link>
                  <Link
                    to="/findpassword"
                    className="font-medium text-gray-700 hover:text-indigo-600 pl-3"
                  >
                    비밀번호 찾기
                  </Link>
                </div>
              </div>
            </div>

            {/* 소셜 로그인 */}
            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white px-6 text-gray-900">
                    소셜 로그인
                  </span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {/* 카카오 로그인 */}
                <button // <--- Link를 button으로 변경
                  onClick={() =>
                    (window.location.href =
                      'https://www.marketten.shop/oauth2/authorization/kakao')
                  }
                  className="flex items-center justify-center gap-3 rounded-md bg-[#FEE500] px-3 py-2 text-sm font-semibold text-[#3C1E1E] shadow-sm hover:bg-[#FFD600]"
                >
                  <img
                    src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png"
                    alt="카카오 로고"
                    className="h-5 w-5"
                  />
                  <span className="hidden sm:inline">카카오</span>
                </button>
                <button
                  // to="https://www.marketten.shop/oauth2/authorization/google"
                  onClick={() =>
                    (window.location.href =
                      'https://www.marketten.shop/oauth2/authorization/google')
                  }
                  className="flex items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5">
                    <path
                      d="M12 4.75c1.77 0 3.355.61 4.605 1.8l3.425-3.425C17.95 1.19 15.235 0 12 0 7.31 0 3.255 2.69 1.28 6.61l3.99 3.095C6.215 6.86 8.87 4.75 12 4.75Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.49 12.275c0-.785-.075-1.545-.19-2.275H12v4.51h6.47c-.29 1.48-1.13 2.74-2.39 3.585l3.865 3.0c2.255-2.09 3.545-5.18 3.545-8.525Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.265 14.295c-.24-.725-.38-1.495-.38-2.295 0-.8.135-1.571.38-2.296l-3.99-3.095C.46 8.23 0 10.06 0 12c0 1.94.46 3.77 1.28 5.39l3.985-3.085Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 24c3.24 0 5.965-1.065 7.945-2.905l-3.865-3.0c-1.075.725-2.46 1.15-4.08 1.15-3.13 0-5.785-2.11-6.735-4.955L1.275 17.385C3.255 21.31 7.31 24 12 24Z"
                      fill="#34A853"
                    />
                  </svg>
                  <span className="hidden sm:inline">구글</span>
                </button>
                <button
                  onClick={() =>
                    (window.location.href =
                      'https://www.marketten.shop/oauth2/authorization/naver')
                  }
                  className="flex items-center justify-center gap-3 rounded-md bg-[#03C75A] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#04D361]"
                >
                  <img src={naverIcon} alt="네이버 로고" className="h-4 w-4" />
                  <span className="hidden sm:inline">네이버</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BasicLayout>
  );
};

export default LoginPage;
