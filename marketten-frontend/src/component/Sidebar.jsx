import React, { useState } from 'react';
import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  Cog6ToothIcon,
  ChartPieIcon,
  CalendarIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

export default function ManagerSidebar({ currentPage, setCurrentPage }) {
  const [openMenus, setOpenMenus] = useState({
    members: false,
    pages: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="px-6 py-4 font-bold text-lg text-indigo-400">
        관리자 메뉴
      </div>

      <ul className="flex-1 space-y-2 px-3">
        {/* 대시보드 */}
        <li>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-md transition ${
              currentPage === 'dashboard'
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-gray-700 text-gray-300'
            }`}
          >
            <HomeIcon className="w-5 h-5" />
            대시보드
          </button>
        </li>

        {/* 회원 관리 */}
        <li>
          <button
            onClick={() => toggleMenu('members')}
            className="flex items-center justify-between w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-700 rounded-md"
          >
            <span className="flex items-center gap-3">
              <UsersIcon className="w-5 h-5" />
              회원 관리
            </span>
            <ChevronRightIcon
              className={`w-4 h-4 transition-transform ${
                openMenus.members ? 'rotate-90 text-indigo-400' : ''
              }`}
            />
          </button>
          {openMenus.members && (
            <ul className="pl-10 mt-1 space-y-1">
              <li>
                <button
                  onClick={() => setCurrentPage('members-general')}
                  className={`block w-full text-left text-sm px-2 py-1 rounded-md ${
                    currentPage === 'members-general'
                      ? 'bg-indigo-600 text-white'
                      : 'hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  일반 회원
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('members-admin')}
                  className={`block w-full text-left text-sm px-2 py-1 rounded-md ${
                    currentPage === 'members-admin'
                      ? 'bg-indigo-600 text-white'
                      : 'hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  관리자
                </button>
              </li>
            </ul>
          )}
        </li>

        {/* 페이지 관리 */}
        <li>
          <button
            onClick={() => toggleMenu('pages')}
            className="flex items-center justify-between w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-700 rounded-md"
          >
            <span className="flex items-center gap-3">
              <FolderIcon className="w-5 h-5" />
              페이지 관리
            </span>
            <ChevronRightIcon
              className={`w-4 h-4 transition-transform ${
                openMenus.pages ? 'rotate-90 text-indigo-400' : ''
              }`}
            />
          </button>
          {openMenus.pages && (
            <ul className="pl-10 mt-1 space-y-1">
              <li>
                <button
                  onClick={() => setCurrentPage('page-main')}
                  className={`block w-full text-left text-sm px-2 py-1 rounded-md ${
                    currentPage === 'page-main'
                      ? 'bg-indigo-600 text-white'
                      : 'hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  메인 페이지
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('page-footer')}
                  className={`block w-full text-left text-sm px-2 py-1 rounded-md ${
                    currentPage === 'page-footer'
                      ? 'bg-indigo-600 text-white'
                      : 'hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  푸터 설정
                </button>
              </li>
            </ul>
          )}
        </li>

        {/* 기능 설정 */}
        <li>
          <button
            onClick={() => setCurrentPage('functions')}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-md transition ${
              currentPage === 'functions'
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-gray-700 text-gray-300'
            }`}
          >
            <Cog6ToothIcon className="w-5 h-5" />
            기능 설정
          </button>
        </li>

        {/* 설정 */}
        <li>
          <button
            onClick={() => setCurrentPage('settings')}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-md transition ${
              currentPage === 'settings'
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-gray-700 text-gray-300'
            }`}
          >
            <CalendarIcon className="w-5 h-5" />
            설정
          </button>
        </li>
      </ul>
      <div className="px-4 py-3 border-t border-gray-700 text-sm text-gray-400">
        <p>관리자</p>
      </div>
    </aside>
  );
}
