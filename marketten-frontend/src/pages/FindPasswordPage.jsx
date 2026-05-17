import { useState } from 'react';
import BasicLayout from '../layout/BasicLayout';
import { LockClosedIcon } from '@heroicons/react/16/solid';
import { useNavigate, Link } from 'react-router-dom'; // Link 임포트 추가
import { resetPassword, checkEmail } from '../api/loginApi';
import { LOGO_URL } from '../assets/Logo_Url';

const FindPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(null);
  const [message, setMessage] = useState('');
  const [emailExists, setEmailExists] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleCancel = () => navigate(-1);

  const handlePasswordChange = (value) => {
    setNewPassword(value);
    setPasswordValid(value.length >= 8);
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
  };

  const handleEmailCheck = async () => {
    if (!email) return;
    try {
      const isAvailable = await checkEmail(email);
      setEmailExists(!isAvailable);
    } catch (err) {
      console.error(err);
      setEmailExists(null);
    }
  };

  const handleSubmit = async () => {
    setMessage('');
    if (!email) {
      setMessage('이메일을 입력해주세요.');
      return;
    }
    if (emailExists === false) {
      setMessage('가입되지 않은 이메일입니다. 다시 확인해주세요.');
      return;
    }
    if (emailExists === null) {
      setMessage('이메일 확인을 먼저 진행해주세요.');
      return;
    }
    if (!passwordValid) {
      setMessage('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ email, newPassword });
      setShowSuccessModal(true);
      setNewPassword('');
      setConfirmPassword('');
      setEmail('');
      setEmailExists(null);
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasicLayout>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex items-center justify-center mb-6">
            <img className="h-24 w-auto" src={LOGO_URL} alt="Marketten" />
          </div>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          {/* ✨ 1. relative 클래스를 추가하여 이 div를 성공 모달의 부모 기준으로 삼습니다. */}
          <div className="relative bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            {/* ========================================================================= */}
            {/* ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ 수정된 부분 ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */}
            {/* ========================================================================= */}
            {/* ✨ 2. 성공 모달을 전체 화면이 아닌, 폼 카드 위에만 덮어쓰도록 위치와 스타일을 변경합니다. */}
            {showSuccessModal && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-95 backdrop-blur-sm rounded-lg z-10 p-6">
                <div className="text-center">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900">
                    비밀번호 변경 완료
                  </h2>
                  <p className="text-sm mb-6 text-gray-600">
                    비밀번호가 성공적으로 변경되었습니다.
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500"
                  >
                    로그인 페이지로 이동
                  </button>
                </div>
              </div>
            )}
            {/* ========================================================================= */}
            {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}
            {/* ========================================================================= */}

            <p className="text-center text-sm text-gray-600 mb-8">
              가입 시 사용한 이메일 주소를 입력하고
              <br />
              새로운 비밀번호를 설정해주세요.
            </p>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* 이메일 */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  이메일
                </label>
                <div className="mt-2 flex items-center">
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailExists(null);
                    }}
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={handleEmailCheck}
                    className="ml-2 flex-shrink-0 px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-500"
                  >
                    확인
                  </button>
                </div>
                {emailExists === true && (
                  <p className="text-xs text-green-600 mt-1">
                    비밀번호 설정이 가능한 이메일입니다.
                  </p>
                )}
                {emailExists === false && (
                  <p className="text-xs text-red-600 mt-1">
                    가입되지 않은 이메일입니다.
                  </p>
                )}
              </div>

              {/* 새 비밀번호 */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  새 비밀번호
                </label>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    type="password"
                    placeholder="새 비밀번호 (8자 이상)"
                    value={newPassword}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  />
                  <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                {passwordValid === false && (
                  <p className="text-xs text-red-600 mt-1">
                    비밀번호는 8자 이상이어야 합니다.
                  </p>
                )}
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  비밀번호 확인
                </label>
                <div className="mt-2 relative">
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="비밀번호 재입력"
                    value={confirmPassword}
                    onChange={(e) =>
                      handleConfirmPasswordChange(e.target.value)
                    }
                    className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  />
                  <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {message && (
                <p className={`text-xs mt-1 text-red-600`}>{message}</p>
              )}

              {/* 버튼 */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex w-full justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold leading-6 text-gray-700 shadow-sm hover:bg-gray-300"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 disabled:bg-indigo-300"
                >
                  {loading ? '변경 중...' : '변경하기'}
                </button>
              </div>

              <div className="mt-8 text-center text-sm">
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  로그인 페이지로 돌아가기
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </BasicLayout>
  );
};

export default FindPasswordPage;
