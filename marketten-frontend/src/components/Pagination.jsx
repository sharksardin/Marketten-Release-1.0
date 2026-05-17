import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';

// 1. 컴포넌트 이름 변경 및 props 받기
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // 2. 전체 페이지 수(totalPages)를 기반으로 페이지 번호 배열 생성
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 dark:border-white/10">
      {/* Previous(이전) 버튼 */}
      <div className="-mt-px flex w-0 flex-1">
        <Link
          to="#"
          // 3. onClick 이벤트 핸들러 추가
          onClick={(e) => {
            e.preventDefault(); // a 태그의 기본 동작 방지
            if (currentPage > 1) {
              onPageChange(currentPage - 1);
            }
          }}
          className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-white/20 dark:hover:text-gray-200"
        >
          <ArrowLongLeftIcon
            aria-hidden="true"
            className="mr-3 size-5 text-gray-400 dark:text-gray-500"
          />
          Previous
        </Link>
      </div>

      {/* 페이지 번호 목록 (자동 생성) */}
      <div className="hidden md:-mt-px md:flex">
        {/* 4. pageNumbers 배열을 map으로 순회하며 페이지 번호 링크를 동적으로 생성 */}
        {pageNumbers.map((number) => (
          <Link
            key={number}
            to="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(number);
            }}
            // 5. 현재 페이지(currentPage)와 번호가 일치하면 강조 스타일 적용
            className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
              currentPage === number
                ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-white/20'
            }`}
            aria-current={currentPage === number ? 'page' : undefined}
          >
            {number}
          </Link>
        ))}
      </div>

      {/* Next(다음) 버튼 */}
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <Link
          to="#"
          onClick={(e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
              onPageChange(currentPage + 1);
            }
          }}
          className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-white/20 dark:hover:text-gray-200"
        >
          Next
          <ArrowLongRightIcon
            aria-hidden="true"
            className="ml-3 size-5 text-gray-400 dark:text-gray-500"
          />
        </Link>
      </div>
    </nav>
  );
}
