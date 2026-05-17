import React, { useState, useEffect } from 'react';
import { getUserList, updateUserRole } from '../api/adminApi';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [changedRoles, setChangedRoles] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const usersPerPage = 5;

  // --- 데이터 로딩 ---
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchUsers = async () => {
      try {
        setLoading(true);

        // MANAGER와 ADMIN을 모두 가져오기 위해 2번 호출 후 합치기
        const managerData = await getUserList(
          currentPage,
          usersPerPage,
          'MANAGER'
        );
        const adminData = await getUserList(currentPage, usersPerPage, 'ADMIN');

        // 두 역할 합치기
        const combinedUsers = [
          ...managerData.userList,
          ...adminData.userList,
        ].map((u) => ({
          ...u,
          role: changedRoles[u.userId] || u.role,
        }));

        setUsers(combinedUsers);
        setFilteredUsers(combinedUsers);
        setTotalPages(Math.max(managerData.totalPages, adminData.totalPages));
        setError(null);
      } catch (err) {
        console.error(err);
        setError('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, changedRoles]);

  // --- 검색 ---
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }
    const filtered = users.filter(
      (u) =>
        u.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  // --- 페이지 이동 ---
  const goToPage = (pageNum) => {
    if (pageNum >= 0 && pageNum < totalPages) setCurrentPage(pageNum);
  };

  // --- 권한 변경 ---
  const handleRoleChange = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.userId === userId ? { ...u, role: newRole } : u))
    );
    setChangedRoles((prev) => ({ ...prev, [userId]: newRole }));
  };

  const handleSaveChanges = async () => {
    if (!Object.keys(changedRoles).length) return;
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
  if (error)
    return (
      <div className="p-6 bg-[#FFF9E6] min-h-screen text-red-500">{error}</div>
    );

  return (
    <div className="p-6 bg-[#FFF9E6] min-h-screen text-[#6B3A00]">
      <h1 className="text-2xl font-bold mb-6 text-[#6B3A00]">
        👩‍💼 관리자/매니저 목록
      </h1>

      {/* 검색창 */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="이름 또는 이메일 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-[#FFD97A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A35C00] bg-white"
        />
        <button className="w-10 h-10 rounded-full bg-[#A35C00] text-white flex items-center justify-center hover:bg-[#8B4F00] transition shadow-md">
          🔍
        </button>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto rounded-lg shadow-md border border-[#FFD97A] bg-white">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-[#A35C00] text-white font-semibold">
            <tr>
              <th className="p-3 border border-[#A35C00] text-left">이름</th>
              <th className="p-3 border border-[#A35C00] text-left">이메일</th>
              <th className="p-3 border border-[#A35C00] text-left">권한</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.userId}
                  className="hover:bg-[#FFF2CC] even:bg-[#FFF5DA] transition-colors"
                >
                  <td className="p-3 border border-gray-300">
                    {user.nickname}
                  </td>
                  <td className="p-3 border border-gray-300">{user.email}</td>
                  <td className="p-3 border border-gray-300">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.userId, e.target.value)
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
            ) : (
              <tr>
                <td colSpan="3" className="p-6 text-center text-gray-500">
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center mt-6 space-x-2 items-center select-none">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 0}
          className={`px-3 py-1 rounded-lg border border-[#A35C00] text-sm font-semibold transition ${
            currentPage === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#FFF9E6] text-[#A35C00] hover:bg-[#FFD97A]'
          }`}
        >
          이전
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={`px-3 py-1 rounded-lg border border-[#A35C00] text-sm font-semibold transition ${
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
          className={`px-3 py-1 rounded-lg border border-[#A35C00] text-sm font-semibold transition ${
            currentPage >= totalPages - 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#FFF9E6] text-[#A35C00] hover:bg-[#FFD97A]'
          }`}
        >
          다음
        </button>
      </div>

      {/* 저장 버튼 */}
      <div className="text-center mt-6">
        <button
          onClick={handleSaveChanges}
          disabled={!Object.keys(changedRoles).length || isSaving}
          className="px-6 py-2 bg-[#A35C00] text-white font-bold rounded-lg hover:bg-[#6B3A00] disabled:bg-gray-400"
        >
          {isSaving ? '저장 중...' : '저장'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
