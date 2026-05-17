import React, { useState, useEffect } from 'react';
import { getUserList, updateUserRole } from '../api/adminApi';

export default function MemberList() {
  const [members, setMembers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [changedRoles, setChangedRoles] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const membersPerPage = 10;

  // --- 데이터 로딩 ---
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchMembers = async () => {
      try {
        setLoading(true);
        const data = await getUserList(currentPage, membersPerPage, 'USER');
        // role 변경이 반영되도록 체크
        const membersWithChanges = data.userList.map((m) => ({
          ...m,
          role: changedRoles[m.userId] || m.role,
        }));
        setMembers(membersWithChanges);
        setAllMembers(membersWithChanges);
        setTotalPages(data.totalPages);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [currentPage, changedRoles]);

  // --- 페이지 이동 ---
  const goToPage = (pageNum) => {
    if (pageNum >= 0 && pageNum < totalPages) setCurrentPage(pageNum);
  };

  // --- 검색 ---
  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setMembers(allMembers);
      setIsSearching(false);
      setTotalPages(Math.ceil(allMembers.length / membersPerPage));
      setCurrentPage(0);
      return;
    }

    const filtered = allMembers.filter((m) =>
      m.nickname.toLowerCase().includes(query)
    );
    setMembers(filtered);
    setIsSearching(true);
    setTotalPages(Math.ceil(filtered.length / membersPerPage));
    setCurrentPage(0);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setMembers(allMembers);
    setIsSearching(false);
    setTotalPages(Math.ceil(allMembers.length / membersPerPage));
    setCurrentPage(0);
  };

  // --- 권한 변경 ---
  const handleRoleChange = (userId, newRole) => {
    setMembers((prev) =>
      prev.map((m) => (m.userId === userId ? { ...m, role: newRole } : m))
    );
    setChangedRoles((prev) => ({ ...prev, [userId]: newRole }));
  };

  const handleSaveChanges = async () => {
    if (Object.keys(changedRoles).length === 0) return;
    setIsSaving(true);
    setError(null);
    try {
      await Promise.all(
        Object.entries(changedRoles).map(([userId, role]) =>
          updateUserRole(userId, role)
        )
      );
      setChangedRoles({});
      alert('권한 변경이 저장되었습니다.');
    } catch (err) {
      console.error(err);
      setError('권한 변경 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading)
    return <div className="p-6 bg-[#FFF9E6] min-h-screen">로딩 중...</div>;

  return (
    <div className="p-6 text-gray-800 bg-[#FFF9E6] min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-[#6B3A00]">회원 관리</h1>

      {/* 검색 */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="닉네임 검색"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#A35C00]"
        />
        <button
          onClick={handleSearch}
          className="px-3 py-2 bg-[#A35C00] text-white rounded-full hover:bg-[#6B3A00]"
        >
          🔍
        </button>
        {isSearching && (
          <button
            onClick={handleSearchClear}
            className="px-3 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
          >
            전체보기
          </button>
        )}
      </div>

      {isSearching && (
        <div className="mb-2 text-sm text-gray-600">
          검색 결과:{' '}
          <span className="font-semibold text-[#A35C00]">
            {members.length}명
          </span>
        </div>
      )}

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm bg-white shadow-md rounded-lg">
          <thead className="bg-[#A35C00] text-white font-semibold">
            <tr>
              <th className="p-3 border border-[#A35C00]">닉네임</th>
              <th className="p-3 border border-[#A35C00]">가입일</th>
              <th className="p-3 border border-[#A35C00]">권한</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-6 text-center text-gray-500">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr
                  key={m.userId}
                  className="hover:bg-amber-50 even:bg-amber-50/40 text-center"
                >
                  <td className="p-3 border border-gray-300">{m.nickname}</td>
                  <td className="p-3 border border-gray-300">
                    {m.createdAt.split('T')[0]}
                  </td>
                  <td className="p-3 border border-gray-300">
                    <select
                      value={m.role}
                      onChange={(e) =>
                        handleRoleChange(m.userId, e.target.value)
                      }
                      className="p-1 border rounded-md focus:ring-2 focus:ring-[#A35C00]"
                    >
                      <option value="USER">USER</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-3 py-1 rounded-lg border border-[#A35C00] text-sm font-semibold disabled:bg-gray-200 disabled:text-gray-400 bg-[#FFF9E6] text-[#A35C00] hover:bg-[#FFD97A]"
        >
          이전
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={`px-3 py-1 rounded-lg border border-[#A35C00] text-sm font-semibold ${
              currentPage === i
                ? 'bg-[#A35C00] text-white'
                : 'bg-[#FFF9E6] text-[#A35C00] hover:bg-[#FFD97A]'
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="px-3 py-1 rounded-lg border border-[#A35C00] text-sm font-semibold disabled:bg-gray-200 disabled:text-gray-400 bg-[#FFF9E6] text-[#A35C00] hover:bg-[#FFD97A]"
        >
          다음
        </button>
      </div>

      {/* 저장 버튼 */}
      <div className="text-center mt-6">
        <button
          onClick={handleSaveChanges}
          disabled={Object.keys(changedRoles).length === 0 || isSaving}
          className="px-6 py-2 bg-[#A35C00] text-white font-bold rounded-lg hover:bg-[#6B3A00] disabled:bg-gray-400"
        >
          {isSaving ? '저장 중...' : '저장'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
