'use client';
import BasicLayout from '../layout/BasicLayout';
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import { getPostsByEmail, deletePost } from '../api/postApi';

// ✨ 1. '진행 단계'를 한글 라벨과 상세 설명으로 변환하는 헬퍼 함수
const getStepInfo = (step) => {
  switch (step) {
    case 1:
      return { label: '1단계', description: '주제/키워드 선정' };
    case 2:
      return { label: '2단계', description: '초고 생성' };
    case 3:
      return { label: '3단계', description: '최종 검토' };
    case 4:
      return { label: '완성', description: '글 발행 완료' };
    default:
      return { label: '알 수 없음', description: '상태를 확인할 수 없습니다.' };
  }
};

// ✨ 2. 백엔드 status를 '진행 중' 또는 '완성'으로 명확히 구분하는 헬퍼 함수
const getKoreanStatus = (status) => {
  return status === 'Complete' ? '완성' : '진행 중';
};

// --- 삭제 확인 모달 (UI 컴포넌트) ---
const DeleteModal = ({ open, setOpen, onDelete }) => (
  <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
    <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon
                  className="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <DialogTitle
                  as="h3"
                  className="text-base font-semibold leading-6 text-gray-900"
                >
                  항목 삭제
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    이 항목을 정말로 삭제하시겠습니까? 이 작업은 되돌릴 수
                    없습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            >
              삭제
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              취소
            </button>
          </div>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
);

// --- 페이지네이션 (UI 컴포넌트) ---
const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-8">
    <div className="-mt-px flex w-0 flex-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
      >
        <ArrowLongLeftIcon
          className="mr-3 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
        이전
      </button>
    </div>
    <div className="hidden md:-mt-px md:flex">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${currentPage === number ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
        >
          {number}
        </button>
      ))}
    </div>
    <div className="-mt-px flex w-0 flex-1 justify-end">
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
      >
        다음
        <ArrowLongRightIcon
          className="ml-3 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </button>
    </div>
  </nav>
);

// --- 메인 보관함 페이지 ---
const StoragePage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // 필터 및 정렬 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc',
  });
  const [activeStatusTab, setActiveStatusTab] = useState('전체'); // ✨ 탭 UI를 위한 상태 ('전체', '진행 중', '완성')

  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- 데이터 로딩 ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const posts = await getPostsByEmail();
        const formattedPosts = (posts || []).map((post) => ({
          id: post.postId,
          tempPostId: post.tempPostId,
          title: post.finalTitle || '제목 없음',
          step: post.step || 1,
          createdAt: post.createdDate ? post.createdDate.split('T')[0] : 'N/A',
          status: post.status || 'UNKNOWN',
        }));
        setData(formattedPosts);
      } catch (error) {
        console.error('데이터 불러오기 실패', error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 핸들러 함수들 ---
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handleStatusTabClick = (status) => {
    setActiveStatusTab(status);
    setCurrentPage(1);
  };

  const openDeleteModal = (id) => {
    setItemToDelete(id);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deletePost(itemToDelete);
      setData(data.filter((item) => item.id !== itemToDelete));
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
    setItemToDelete(null);
  };

  const handleRowClick = (item) => {
    const targetId = item.tempPostId || item.id;

    if (item.step === 4) {
      navigate('/details', { state: { id: targetId } });
    } else if (item.step === 1) {
      navigate('/write/1', { state: { tempPostId: targetId } });
    } else {
      navigate(`/write/${item.step}`, { state: { tempPostId: targetId } });
    }
  };
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // --- 데이터 필터링, 정렬, 페이징 (useMemo로 성능 최적화) ---
  const processedData = useMemo(() => {
    return [...data]
      .filter((item) => {
        const searchMatch = (item.title || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const statusMatch =
          activeStatusTab === '전체'
            ? true
            : getKoreanStatus(item.status) === activeStatusTab;
        return searchMatch && statusMatch;
      })
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [data, searchTerm, activeStatusTab, sortConfig]);

  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, processedData]);

  if (isLoading) {
    return (
      <BasicLayout>
        <div className="p-8 text-center">데이터를 불러오는 중입니다...</div>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout>
      <div className="p-8 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">보관함</h1>
        <div className="flex border-b border-gray-200 mb-6">
          {['전체', '진행 중', '완성'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleStatusTabClick(tab)}
              className={`py-2 px-4 text-sm font-medium transition-colors duration-200 ${
                activeStatusTab === tab
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center mb-6">
          <input
            type="text"
            placeholder="제목으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <table className="min-w-full table-auto divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* ✨ 4. 테이블 헤더를 드롭다운 없는 단순 텍스트와 정렬 버튼으로 변경 */}
                <th className="w-[40%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <button
                    onClick={() => handleSort('title')}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    제목
                    <span>
                      {sortConfig.key === 'title' &&
                        (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </span>
                  </button>
                </th>
                <th className="w-[25%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  진행 단계
                </th>
                <th className="w-[20%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <button
                    onClick={() => handleSort('createdAt')}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    작성일
                    <span>
                      {sortConfig.key === 'createdAt' &&
                        (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </span>
                  </button>
                </th>
                <th className="w-[15%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  상태
                </th>
                <th className="px-6 py-3 relative text-right">삭제</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleRowClick(item)}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 truncate max-w-xs">
                      {item.title}
                    </td>

                    {/* ✨ 5. 바디: 진행도 바 대신 '단계'와 '설명'을 텍스트로 명확하게 표시 */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="font-semibold">
                        {getStepInfo(item.step).label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getStepInfo(item.step).description}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.createdAt}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.step === 4
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {getKoreanStatus(item.status)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(item.id);
                        }}
                        className="w-8 h-8 text-red-600 hover:text-red-900 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">
                    표시할 항목이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <DeleteModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        onDelete={handleDelete}
      />
    </BasicLayout>
  );
};

export default StoragePage;
