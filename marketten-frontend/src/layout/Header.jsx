import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LOGO_URL } from '../assets/Logo_Url';
import defaultProfile from '../assets/default_profile.png';
// 올바른 API 함수를 가져옵니다.
import { getMyInfo } from '../api/userApi';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState(null);
  const [profileImg, setProfileImg] = useState(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false); //  ? 버튼 말풍선

  // ✨ useEffect 로직을 버그가 없고 더 안정적인 방식으로 수정합니다.
  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    // 1. 토큰이 없으면, 확실하게 로그아웃 상태로 만들고 로딩을 종료합니다.
    if (!token) {
      setIsLogin(false); // <--- 이 부분이 핵심입니다!
      setLoading(false);
      return; // 더 이상 진행하지 않음
    }

    // 2. 토큰이 있으면, API를 호출하여 유효성을 검증합니다.
    const fetchUser = async () => {
      try {
        const data = await getMyInfo();

        // 성공 시: 로그인 상태로 전환
        setRole(data.role);
        if (data.imageUrl) setProfileImg(data.imageUrl);
        setIsLogin(true);
      } catch (err) {
        // 실패 시: 로그아웃 상태로 전환하고, 잘못된 토큰은 삭제합니다.
        console.error('헤더 사용자 정보 로딩 실패 (유효하지 않은 토큰):', err);
        setIsLogin(false);
        setRole(null);
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // [] : 페이지가 처음 로드될 때 딱 한 번만 실행

  if (loading) return null;

  const handleCreateClick = () => {
    // localStorage에서 온보딩 필요 여부를 확인합니다. ('true'/'false' 문자열로 저장됨)
    const needsOnboarding = localStorage.getItem('needsOnboarding') === 'true';

    if (needsOnboarding) {
      // 온보딩이 필요하면, 튜토리얼 신호와 함께 이동
      navigate('/write/1?tour=true');
    } else {
      // 필요 없으면, 일반 글쓰기 페이지로 이동
      navigate('/write/1');
    }
  };

  return (
    // --- 이하 JSX 코드는 변경 없이 그대로 사용 ---
    <Disclosure
      as="nav"
      className="relative bg-amber-100 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
    >
      <div className="mx-10 max-w-8xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="block size-6 group-data-open:hidden" />
              <XMarkIcon className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>

          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Link to="/">
                <img alt="Marketten" src={LOGO_URL} className="h-8 w-auto" />
              </Link>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="hidden sm:flex sm:ml-40 sm:space-x-4">
              {/* 툴팁 */}
              {showTooltip && (
                <div className=" right-full mr-2 w-max max-w-xs rounded-md bg-white px-3 py-1.5 text-sm text-gray-600 shadow-lg z-50 whitespace-nowrap">
                  상세한 글 작성 가이드
                </div>
              )}

              {/* ? 버튼 */}
              <Link
                to="/menu"
                className="w-6 h-6 mt-1.5 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                ?
              </Link>

              {!isLogin && (
                <Link
                  to="/login"
                  className="bg-amber-900 text-white hover:bg-amber-900/60 hover:text-gray-300 rounded-md px-3 py-2 text-sm font-medium"
                >
                  로그인
                </Link>
              )}

              {isLogin && role === 'USER' && (
                <>
                  <Link
                    to="/write/1"
                    className="bg-red-600 text-white hover:bg-amber-700 rounded-md px-3 py-2 text-sm font-medium"
                  >
                    생성하기
                  </Link>
                  <Link
                    to="/storage"
                    className="bg-amber-900 text-white hover:bg-amber-900/60 hover:text-gray-300 rounded-md px-3 py-2 text-sm font-medium"
                  >
                    보관함
                  </Link>
                </>
              )}
            </div>

            {isLogin && role && (
              <Menu as="div" className="relative ml-3">
                <MenuButton className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gray-300 overflow-hidden border-2 border-amber-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 cursor-pointer">
                  <span className="sr-only">Open user menu</span>
                  <img
                    src={profileImg}
                    alt="프로필 이미지"
                    className="w-full h-full object-cover"
                  />
                </MenuButton>

                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 outline-0">
                  {(role === 'ADMIN' || role === 'MANAGER') && (
                    <MenuItem>
                      <Link
                        to="/manager"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                      >
                        관리자 페이지
                      </Link>
                    </MenuItem>
                  )}
                  {role === 'USER' && (
                    <MenuItem>
                      <Link
                        to="/mypage"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                      >
                        마이 페이지
                      </Link>
                    </MenuItem>
                  )}
                  <MenuItem>
                    <button
                      onClick={() => {
                        localStorage.clear();
                        window.location.href = '/';
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                    >
                      로그아웃
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden px-2 pt-2 pb-3 space-y-1">
        <Link
          to="/write/1"
          className="bg-indigo-600 text-white block rounded-md px-3 py-2 text-base font-medium"
        >
          생성하기
        </Link>
        {!isLogin && (
          <Link
            to="/login"
            className="bg-amber-900 text-white block rounded-md px-3 py-2 text-base font-medium"
          >
            로그인
          </Link>
        )}
        {isLogin && role === 'USER' && (
          <Link
            to="/storage"
            className="bg-amber-900 text-white block rounded-md px-3 py-2 text-base font-medium"
          >
            보관함
          </Link>
        )}
      </DisclosurePanel>
    </Disclosure>
  );
};

export default Header;
