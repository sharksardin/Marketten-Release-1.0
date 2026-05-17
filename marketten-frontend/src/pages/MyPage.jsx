'use client';

import React, { useState, useRef, useEffect } from 'react';

import {
  getMyInfo,
  updateMyInfo,
  withdrawMe,
  updateMyPassword,
  initMyPassword,
} from '../api/userApi'; // userApi.js 파일 경로를 확인하세요.

import BasicLayout from '../layout/BasicLayout';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import {
  ExclamationTriangleIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import defaultProfile from '../assets/default_profile.png';
import { checkNickname } from '../api/loginApi.js';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
  // --- 상태 관리 ---
  const [userData, setUserData] = useState(null);
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isModifyingName, setIsModifyingName] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState(null);
  const fileInputRef = useRef(null);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSocialPasswordModalOpen, setIsSocialPasswordModalOpen] =
    useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const data = await getMyInfo();
        setUserData(data);
        setNickname(data.nickname);
        setProfileImage(data.imageUrl || defaultProfile);
      } catch (error) {
        console.error('사용자 정보 로딩 실패:', error);
        alert('사용자 정보를 불러오는 데 실패했습니다. 다시 로그인해주세요.');
      }
    };
    fetchMyData();
  }, []);

  // --- 이벤트 핸들러 ---
  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfileImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  // 닉네임 변경, 취소 버튼 핸들러
  const handleModifyNickname = () => {
    if (isModifyingName) {
      setNickname(userData.nickname);
      setNicknameAvailable(null);
    }
    setIsModifyingName(!isModifyingName);
  };

  // 닉네임 입력란 핸들러
  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
    setNicknameAvailable(null);
  };

  //닉네임 중복 확인 버튼 핸들러
  const handleNicknameCheck = async () => {
    if (!nickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    try {
      const available = await checkNickname(nickname);
      setNicknameAvailable(available);
      if (!available) {
        userData.nickname == nickname
          ? setNicknameAvailable(!available)
          : setNicknameAvailable(available);
      }
    } catch (err) {
      console.error(err);
      setNicknameAvailable(false);
    }
  };

  const handleSave = async () => {
    try {
      const updates = {};

      // 닉네임이 변경되었는지 확인
      if (userData.nickname !== nickname) {
        // 닉네임이 변경되었다면, 중복 확인이 되었는지 체크
        if (!nicknameAvailable) {
          alert('닉네임 중복 체크를 해주세요.');
          return;
        }
        updates.nickname = nickname;
      }

      if (imageFile) {
        updates.profileImage = imageFile;
      }

      if (Object.keys(updates).length > 0) {
        await updateMyInfo(updates);
        alert('정보가 성공적으로 저장되었습니다.');
        window.location.reload();
      } else {
        alert('변경할 내용이 없습니다.');
      }
    } catch (error) {
      console.error('정보 저장 실패:', error);
      alert('정보 저장에 실패했습니다.');
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmNewPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!currentPassword || !newPassword) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    try {
      await updateMyPassword({ currentPassword, newPassword });
      alert('비밀번호가 성공적으로 변경되었습니다.');
      setIsPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      alert('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
    }
  };

  const handleSocialPasswordInit = async () => {
    if (newPassword !== confirmNewPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!newPassword) {
      alert('새 비밀번호를 입력해주세요.');
      return;
    }
    try {
      await initMyPassword({ newPassword });
      alert(
        '비밀번호가 성공적으로 설정되었습니다. 이제 일반 로그인을 사용할 수 있습니다.'
      );
      setIsSocialPasswordModalOpen(false);
      setNewPassword('');
      setConfirmNewPassword('');
      setUserData({ ...userData, passwordExists: true });
    } catch (error) {
      console.error('비밀번호 설정 실패:', error);
      alert('비밀번호 설정에 실패했습니다.');
    }
  };

  const handleWithdrawal = async () => {
    try {
      await withdrawMe();
      alert('회원 탈퇴가 완료되었습니다. 이용해주셔서 감사합니다.');
      setIsWithdrawModalOpen(false);
      localStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      alert('회원 탈퇴 처리 중 오류가 발생했습니다.');
      setIsWithdrawModalOpen(false);
    }
  };

  const goToStorage = (status) => {
    if (status) {
      navigate(`/storage?status=${status}`);
    } else {
      navigate(`/storage`);
    }
  };

  if (!userData) {
    return (
      <BasicLayout>
        <div className="flex h-screen items-center justify-center">
          로딩 중...
        </div>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout>
      <div className="w-full bg-indigo-950 py-10">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-5 px-5">
          {/* 프로필 사진 영역 */}
          <div className="flex flex-col items-center gap-4">
            <img
              src={profileImage}
              alt="Profile"
              className="size-40 rounded-full border-4 border-white object-cover shadow-lg"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
            <button
              onClick={handleEditClick}
              className="rounded-md bg-slate-600 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              프로필 사진 변경
            </button>
          </div>

          <div className="mt-6 w-full self-start">
            <div className="arrow-title relative flex h-10 items-center justify-center self-start rounded-md bg-orange-300 px-5 font-bold text-white">
              개인정보
            </div>
          </div>

          {/* 정보 리스트 */}
          <div className="w-full">
            <div className="mb-2.5 flex w-full items-center rounded-lg border border-gray-200 p-3 shadow-sm">
              <label
                htmlFor="nickname"
                className="w-[120px] flex-shrink-0 font-bold text-gray-600"
              >
                닉네임:
              </label>
              {isModifyingName ? (
                <div className="flex w-full justify-between items-center">
                  <input
                    id="nickname"
                    name="nickname"
                    type="text"
                    value={nickname}
                    onChange={handleNicknameChange}
                    required
                    className="flex-grow rounded-md border px-1 py-1.5 h-7"
                  />
                  <span
                    className={`ml-2 w-6 h-6 flex items-center justify-center rounded-full border ${
                      nicknameAvailable === null ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    {nicknameAvailable && (
                      <CheckIcon className="w-4 h-4 text-green-600" />
                    )}
                    {nicknameAvailable === false && (
                      <XMarkIcon className="w-4 h-4 text-red-600" />
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={handleNicknameCheck}
                    className="ml-2 rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                  >
                    중복확인
                  </button>
                  <button
                    type="button"
                    onClick={handleModifyNickname}
                    className="ml-2 rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <div className="flex w-full justify-between items-center">
                  <span className="text-gray-600">{userData.nickname}</span>
                  <button
                    type="button"
                    onClick={handleModifyNickname}
                    className="ml-2 rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                  >
                    변경하기
                  </button>
                </div>
              )}
            </div>

            <div className="mb-2.5 flex w-full items-center rounded-lg border border-gray-200 p-3 shadow-sm">
              <span className="w-[120px] flex-shrink-0 font-bold text-gray-600">
                가입일:
              </span>
              <span className="text-gray-600">
                {userData.createdAt
                  ? userData.createdAt.split('T')[0]
                  : '기록 없음'}
              </span>
            </div>
            <div className="mb-2.5 flex w-full items-center rounded-lg border border-gray-200 p-3 shadow-sm">
              <span className="w-[120px] flex-shrink-0 font-bold text-gray-600">
                최근 로그인:
              </span>
              <span className="text-gray-600">
                {userData.lastLoginAt
                  ? userData.lastLoginAt.split('T')[0]
                  : '기록 없음'}
              </span>
            </div>

            <div className="mx-auto max-w-4xl p-5">
              <h2 className="text-xl font-bold mb-4">내 글 현황</h2>
              <div className="flex gap-4">
                <div
                  className="flex-1 cursor-pointer rounded-lg border p-4 text-center shadow hover:bg-gray-100"
                  onClick={() => goToStorage('temp')}
                >
                  <div className="text-sm font-semibold">진행 중인 글</div>
                  <div className="text-2xl font-bold">
                    {userData.totalTempPosts}
                  </div>
                </div>
                <div
                  className="flex-1 cursor-pointer rounded-lg border p-4 text-center shadow hover:bg-gray-100"
                  onClick={() => goToStorage('complete')}
                >
                  <div className="text-sm font-semibold">완성된 글</div>
                  <div className="text-2xl font-bold">
                    {userData.totalFinalPosts}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="mt-2.5 left- flex flex-wrap justify-center">
            {' '}
            <button
              onClick={handleSave}
              className="m-1.5 cursor-pointer rounded-md bg-gray-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-gray-700"
            >
              저장
            </button>
            {userData.provider === 'SITE' && (
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="m-1.5 cursor-pointer rounded-md bg-orange-300 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-600"
              >
                비밀번호 변경
              </button>
            )}
            {userData.provider !== 'SITE' &&
              userData.passwordExists === false && (
                <button
                  onClick={() => setIsSocialPasswordModalOpen(true)}
                  className="m-1.5 cursor-pointer rounded-md bg-amber-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-800"
                >
                  비밀번호 초기 세팅(소셜용)
                </button>
              )}
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="m-1.5 cursor-pointer rounded-md bg-red-600 px-5 py-2.5 ml-130 text-sm font-bold text-white hover:bg-red-700"
            >
              회원 탈퇴
            </button>
          </div>
          <div className="mt-2.5 flex flex-wrap justify-center"></div>
        </div>
      </div>

      {/* --- 모달(팝업창) 영역 --- */}
      {/* 회원 탈퇴 확인 모달 */}
      <Dialog
        open={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-sm rounded-lg bg-white p-6">
            <DialogTitle className="font-semibold">회원 탈퇴</DialogTitle>
            <p className="mt-2 text-sm text-gray-500">
              정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="rounded px-4 py-2 text-sm bg-gray-200"
              >
                취소
              </button>
              <button
                onClick={handleWithdrawal}
                className="rounded px-4 py-2 text-sm text-white bg-red-600"
              >
                탈퇴
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* 비밀번호 변경 모달 */}
      <Dialog
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              비밀번호 변경
            </DialogTitle>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  현재 비밀번호
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  새 비밀번호
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  새 비밀번호 확인
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
              >
                취소
              </button>
              <button
                onClick={handlePasswordUpdate}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
              >
                변경하기
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* 소셜용 비밀번호 초기 설정 모달 */}
      <Dialog
        open={isSocialPasswordModalOpen}
        onClose={() => setIsSocialPasswordModalOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              비밀번호 설정
            </DialogTitle>
            <p className="mt-2 text-sm text-gray-500">
              소셜 계정에 사용할 비밀번호를 설정합니다. 설정 후에는 일반
              로그인도 가능합니다.
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  새 비밀번호
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  새 비밀번호 확인
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setIsSocialPasswordModalOpen(false)}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
              >
                취소
              </button>
              <button
                onClick={handleSocialPasswordInit}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
              >
                설정하기
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </BasicLayout>
  );
};

export default MyPage;
