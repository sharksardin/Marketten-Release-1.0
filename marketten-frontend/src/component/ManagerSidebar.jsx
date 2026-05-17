import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import {
  CalendarIcon,
  ChartPieIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ManagerSidebar({ currentPage, setCurrentPage }) {
  const navigation = [
    { name: '대시보드', key: 'dashboard', icon: HomeIcon },
    {
      name: '회원 관리',
      key: 'members',
      icon: UsersIcon,
      children: [
        { name: '일반 회원', key: 'members-general' },
        { name: '관리자', key: 'members-admin' },
      ],
    },
    {
      name: '페이지 관리',
      key: 'page',
      icon: FolderIcon,
      children: [
        { name: '메인 페이지', key: 'page-main' },
        { name: '푸터 설정', key: 'page-footer' },
      ],
    },
    { name: '기능 설정', key: 'functions', icon: Cog6ToothIcon },
  ];

  return (
    <div className="flex h-full flex-col border-r border-[#FFD97A] bg-[#FFF9E6] px-6">
      {/* 로고 영역 */}
      <div className="flex h-16 items-center justify-center border-b border-[#FFD97A]">
        <img
          alt="Marketten"
          src="https://marketten.s3.us-east-1.amazonaws.com/MKTLogo2.png"
          className="h-8 w-auto"
        />
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 overflow-y-auto">
        <ul role="list" className="space-y-2 mt-4">
          {navigation.map((item) => (
            <li key={item.key}>
              {!item.children ? (
                <button
                  onClick={() => setCurrentPage(item.key)}
                  className={classNames(
                    currentPage === item.key
                      ? 'bg-[#FFD97A]/60 text-[#6B3A00] font-semibold'
                      : 'hover:bg-[#FFF2CC] text-[#A35C00]',
                    'flex w-full items-center gap-x-3 rounded-md p-2 text-sm transition-all'
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0 text-[#A35C00]" />
                  {item.name}
                </button>
              ) : (
                <Disclosure as="div">
                  <DisclosureButton
                    className={classNames(
                      'flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-medium text-[#A35C00] hover:bg-[#FFF2CC] transition'
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0 text-[#A35C00]" />
                    {item.name}
                    <ChevronRightIcon className="ml-auto h-4 w-4 shrink-0 transition-transform group-data-[open]:rotate-90 text-[#A35C00]" />
                  </DisclosureButton>
                  <DisclosurePanel as="ul" className="ml-8 mt-1 space-y-1">
                    {item.children.map((sub) => (
                      <li key={sub.key}>
                        <button
                          onClick={() => setCurrentPage(sub.key)}
                          className={classNames(
                            currentPage === sub.key
                              ? 'text-[#A35C00] font-semibold'
                              : 'text-[#8B5E00] hover:text-[#A35C00]',
                            'block w-full text-left py-1.5 text-sm transition'
                          )}
                        >
                          {sub.name}
                        </button>
                      </li>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-[#FFD97A] py-3"></div>
    </div>
  );
}
