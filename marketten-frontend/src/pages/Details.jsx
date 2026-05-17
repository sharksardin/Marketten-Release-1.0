import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import BasicLayout from '../layout/BasicLayout';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { getPost, updatePost } from '../api/postApi';

const Details = () => {
  const navigate = useNavigate();
  const editorRef = useRef();
  const location = useLocation();
  const postId = location.state?.id;

  const [content, setContent] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // 1️⃣ 토큰 & 이메일 확인
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const email = localStorage.getItem('email');
    console.log('Header useEffect 실행', token, email);
  }, []);

  // 🔹 데이터 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const data = await getPost(postId);
        console.log('불러온 데이터:', data);

        // 제목 설정
        const title = data.finalTitle || data.title || '';
        setSelectedTitle(title);

        // content 필드 설정 (API 응답 구조에 맞게 수정)
        const contentData = data.finalContent || data.markdown || '';
        setContent(contentData);

        // Editor에 값 설정
        if (editorRef.current && contentData) {
          setTimeout(() => {
            editorRef.current.getInstance().setMarkdown(contentData);
          }, 100);
        }
      } catch (err) {
        console.error('데이터 불러오기 실패:', err);
        setError('데이터를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  // 🔹 제목 변경 핸들러
  const handleTitleChange = (e) => {
    setSelectedTitle(e.target.value);
  };

  // Markdown 복사 (제목 + 본문)
  const handleCopyMarkdown = () => {
    const md = editorRef.current.getInstance().getMarkdown();
    const textToCopy = `${selectedTitle}\n\n${md}`; // 제목을 Markdown H1로 붙임
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => alert('Markdown 복사 완료!'))
      .catch((err) => console.error(err));
  };

  // HTML 복사 (제목 + 본문)
  const handleCopyHTML = () => {
    const html = editorRef.current.getInstance().getHTML();
    const textToCopy = `${selectedTitle}\n${html}`; // 제목을 HTML h1 태그로 붙임
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => alert('HTML 복사 완료!'))
      .catch((err) => console.error(err));
  };

  // 일반 복사 (미리보기 영역, 제목 포함)
  const handleCopyPlain = () => {
    const preview = document.querySelector('.toastui-editor-contents');
    if (!preview) return alert('복사 실패');

    // 제목 + 내용
    const textToCopy = `${selectedTitle}\n\n${preview.innerText}`;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => alert('일반 텍스트 복사 완료!'))
      .catch((err) => console.error(err));
  };

  // 🔹 저장
  const handleSave = async () => {
    try {
      const md = editorRef.current.getInstance().getMarkdown();

      const postData = {
        finalTitle: selectedTitle,
        finalContent: md,
      };

      console.log('저장할 제목:', selectedTitle);
      console.log('저장할 Markdown:', md);

      await updatePost(postId, postData);
      alert('저장 완료!');
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

  // 🔹 목록으로 이동
  const handleGoBack = () => {
    navigate('/storage');
  };

  if (isLoading) {
    return (
      <BasicLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-gray-600">데이터를 불러오는 중입니다...</p>
        </div>
      </BasicLayout>
    );
  }

  if (error) {
    return (
      <BasicLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">{error}</p>
            <button
              onClick={handleGoBack}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout>
      <div className="flex flex-col lg:flex-row gap-6 p-6 min-h-screen bg-gray-50">
        {/* Editor */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-200 p-4 flex flex-col">
          <h2 className="text-center font-semibold text-lg mb-4">
            마크다운 작성 및 미리보기
          </h2>
          <div className="flex-1 flex flex-col">
            {/* 제목 입력 */}
            <input
              type="text"
              value={selectedTitle}
              onChange={handleTitleChange}
              placeholder="제목을 입력하세요"
              className="w-full text-xl font-semibold border-b border-gray-400 focus:outline-none focus:border-indigo-500 px-2 py-2 text-gray-900 mb-4"
            />
            <div className="flex-1">
              <Editor
                ref={editorRef}
                initialValue={content}
                previewStyle="vertical"
                height="100%"
                initialEditType="wysiwyg"
                useCommandShortcut={true}
                hideModeSwitch={true}
                toolbarItems={[
                  ['heading', 'bold', 'italic', 'strike'],
                  ['hr', 'quote'],
                  ['ul', 'ol', 'task', 'indent', 'outdent'],
                  ['table', 'link'],
                  ['code', 'codeblock'],
                ]}
                onChange={() => {
                  const md = editorRef.current.getInstance().getMarkdown();
                  setContent(md);
                }}
              />
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-full max-w-xs flex flex-col justify-between space-y-4">
          {/* 복사 버튼 */}
          <div className="flex flex-col space-y-2">
            <button
              type="button"
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              onClick={() => setIsOpen(true)}
            >
              블로그 별 복사 가이드
            </button>

            {/* Markdown 복사 */}
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              📋 Markdown 복사
            </button>

            {/* HTML 복사 */}
            <button
              type="button"
              onClick={handleCopyHTML}
              className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
            >
              💾 HTML 복사
            </button>

            {/* 일반 복사 */}
            <button
              type="button"
              onClick={handleCopyPlain}
              className="w-full px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition"
            >
              📝 일반 복사
            </button>
          </div>

          {/* 저장 / 목록 버튼 */}
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 w-full bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              💾 저장
            </button>
            <button
              onClick={handleGoBack}
              className="px-4 py-2 w-full bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
            >
              🏠 목록으로
            </button>
          </div>
        </div>

        {/* 블로그 가이드 모달 */}
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/50" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-lg font-semibold">
                  블로그 복사 가이드
                </Dialog.Title>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-medium">Velog</h4>
                  <p>- 마크다운 그대로 붙여넣기 가능</p>
                  <p>- 글, 코드, 이미지 대부분 그대로 적용됨</p>
                </div>
                <div>
                  <h4 className="font-medium">Tistory</h4>
                  <p>- HTML 또는 마크다운 붙여넣기 가능</p>
                  <p>- 스타일 일부 깨질 수 있음</p>
                </div>
                <div>
                  <h4 className="font-medium">Naver Blog</h4>
                  <p>- 일반 에디터에서 복사 붙여넣기만 가능</p>
                  <p>- 마크다운/HTML은 지원되지 않음</p>
                  <p>- 이미지, 링크 등은 에디터에서 다시 설정 필요</p>
                </div>
                <div>
                  <h4 className="font-medium">제목 복사</h4>
                  <p>- 제목은 복사 붙이기 후 상단에 위치해 있음</p>
                  <p>- 제목만 떼어내어 제목란에 복사 붙여넣기</p>
                </div>
              </div>

              <div className="mt-6 text-right">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  닫기
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </BasicLayout>
  );
};

export default Details;
