import { useState } from 'react';
import BasicLayout from '../layout/BasicLayout';
import { useNavigate } from 'react-router-dom';
import { register, checkEmail, checkNickname } from '../api/loginApi'; // API 함수는 그대로 사용합니다.
import { LOGO_URL } from '../assets/Logo_Url';

// ✨ 프론트엔드 자체 유효성 검증 로직을 별도의 함수로 분리하여 가독성을 높입니다.
const validateInput = (name, value, formData) => {
  switch (name) {
    case 'email':
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!value) return '이메일을 입력해주세요.';
      if (!emailRegex.test(value)) return '유효한 이메일 형식이 아닙니다.';
      break;
    case 'nickname':
      if (!value) return '닉네임을 입력해주세요.';
      if (value.length < 2) return '닉네임은 2자 이상이어야 합니다.';
      break;
    case 'password':
      if (!value) return '비밀번호를 입력해주세요.';
      if (value.length < 8) return '비밀번호는 8자 이상이어야 합니다.';
      break;
    case 'passwordCheck':
      if (!value) return '비밀번호 확인을 입력해주세요.';
      if (value !== formData.password) return '비밀번호가 일치하지 않습니다.';
      break;
    default:
      return '';
  }
  return '';
};

const RegisterPage = () => {
  const navigate = useNavigate();

  // --- 상태 관리 ---
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    passwordCheck: '',
  });

  // ✨ 에러 메시지를 한 곳에서 관리하는 객체를 사용합니다.
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // 중복 제출 방지용

  // --- 이벤트 핸들러 ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // ✨ 사용자가 다시 입력을 시작하면, 해당 필드의 에러 메시지를 지웁니다.
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // ✨ 모든 유효성 검증을 처리하는 핵심 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // 이미 제출 중이면 중복 실행 방지

    setIsSubmitting(true);
    setErrors({}); // 이전 에러 메시지 초기화

    // 1. 프론트엔드 자체 유효성 검증
    const validationErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateInput(key, formData[key], formData);
      if (error) validationErrors[key] = error;
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // 2. 백엔드 API를 통한 중복 검증 (이메일, 닉네임 동시 확인)
      const [emailAvailable, nicknameAvailable] = await Promise.all([
        checkEmail(formData.email),
        checkNickname(formData.nickname),
      ]);

      const serverErrors = {};
      if (!emailAvailable) {
        serverErrors.email = '이미 사용 중인 이메일입니다.';
      }
      if (!nicknameAvailable) {
        serverErrors.nickname = '이미 사용 중인 닉네임입니다.';
      }

      if (Object.keys(serverErrors).length > 0) {
        setErrors(serverErrors);
        return; // 여기서 finally 블록으로 이동하여 isSubmitting을 false로 설정
      }

      // 3. 모든 검증 통과 시, 최종 회원가입 요청
      const userRequest = {
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
      };

      const tokenInfo = await register(userRequest);

      // 4. 토큰 및 온보딩 정보 저장
      localStorage.setItem('accessToken', tokenInfo.accessToken);
      localStorage.setItem('refreshToken', tokenInfo.refreshToken);
      localStorage.setItem('email', formData.email);
      localStorage.setItem('needsOnboarding', tokenInfo.needsOnboarding);

      // 5. 온보딩 필요 여부에 따라 적절한 페이지로 이동
      if (tokenInfo.needsOnboarding) {
        alert(
          'Marketten에 오신 것을 환영합니다! 간단한 사용법을 안내해 드릴게요.'
        );
        // ✨ navigate 대신 window.location.href를 사용하여 페이지를 완전히 새로고침합니다.
        window.location.href = '/write/1?tour=true';
      } else {
        // ✨ navigate 대신 window.location.href를 사용하여 페이지를 완전히 새로고침합니다.
        window.location.href = '/';
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false); // 성공/실패 여부와 관계없이 제출 상태 해제
    }
  };

  const handleCancel = () => navigate(-1);

  return (
    <BasicLayout>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm flex flex-1 flex-col justify-center px-6 py-12 sm:px-8">
            <div className="mx-auto w-full">
              <div className="flex items-center justify-center mb-4">
                <img alt="Marketten" src={LOGO_URL} className="h-24 w-auto" />
              </div>

              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                {/* 닉네임 */}
                <div>
                  <label
                    htmlFor="nickname"
                    className="block text-sm font-medium text-gray-900"
                  >
                    닉네임
                  </label>
                  <div className="mt-1">
                    <input
                      id="nickname"
                      name="nickname"
                      type="text"
                      value={formData.nickname}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    />
                    {errors.nickname && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.nickname}
                      </p>
                    )}
                  </div>
                </div>

                {/* 이메일 */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-900"
                  >
                    이메일
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* 비밀번호 */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-900"
                  >
                    비밀번호
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    />
                    {errors.password && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                {/* 비밀번호 확인 */}
                <div>
                  <label
                    htmlFor="passwordCheck"
                    className="block text-sm font-medium text-gray-900"
                  >
                    비밀번호 재확인
                  </label>
                  <div className="mt-1">
                    <input
                      id="passwordCheck"
                      name="passwordCheck"
                      type="password"
                      value={formData.passwordCheck}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    />
                    {errors.passwordCheck && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.passwordCheck}
                      </p>
                    )}
                  </div>
                </div>

                {/* 버튼 */}
                <div className="flex gap-2 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-1/2 rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-1/2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-indigo-300"
                  >
                    {isSubmitting ? '가입 처리 중...' : '회원가입'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </BasicLayout>
  );
};

export default RegisterPage;
