import BasicLayout from '../layout/BasicLayout';
import Header from '../layout/Header';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { LockClosedIcon, CheckIcon } from '@heroicons/react/20/solid';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

// Toast UI Editor 추가
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { useEffect, useState, useRef } from 'react';
import { getPost, updatePost } from '../api/postApi'; // 최종 글 조회 API
import { deleteTempPost } from '../api/tempPostApi';
import LoadingPage from '../pages/LoadingPage';

const steps = [
  {
    name: '주제 설정',
    description: '글의 주제를 설정하는 단계입니다.',
    href: '/write/1',
    status: 'complete',
  },
  {
    name: '초안 생성',
    description: '글의 초안을 생성하는 단계입니다.',
    href: '/write/2',
    status: 'complete',
  },
  {
    name: '글 복사',
    description: '글을 완성하여 복사하는 단계입니다.',
    href: '/write/3',
    status: 'current',
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Write3 = () => {
  const navigate = useNavigate();
  const editorRef = useRef();
  const location = useLocation();
  const inputId = location.state?.tempPostId;

  const [content, setContent] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  //로딩
  const [loadingMessage, setLoadingMessage] = useState('');

  // 1️⃣ 토큰 & 이메일 확인
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const email = localStorage.getItem('email');
    console.log('Header useEffect 실행', token, email);
  }, []);

  // ✅ 1. 최종글 불러오기
  useEffect(() => {
    const fetchFinalPost = async () => {
      try {
        const res = await getPost(inputId);
        setSelectedTitle(res.finalTitle || '');
        setContent(res.finalContent || '');

        // 에디터에 내용 업데이트
        if (editorRef.current) {
          editorRef.current.getInstance().setMarkdown(res.finalContent || '');
        }
      } catch (err) {
        console.error('최종글 불러오기 실패:', err);
      }
    };
    fetchFinalPost();
  }, [inputId]);

  // ✅ 2. 본문 수정 핸들러
  const handleContentChange = () => {
    const md = editorRef.current?.getInstance()?.getMarkdown();
    setContent(md);
  };

  // ✅ 3. 제목 수정 핸들러
  const handleTitleChange = (e) => {
    setSelectedTitle(e.target.value);
  };

  // ✅ 4. 최종 저장
  const handleFinalSave = async () => {
    if (!inputId) {
      console.error('inputId 없음, 저장 불가');
      return;
    }
    setLoadingMessage('저장 후 보관함으로 이동합니다');
    setLoading(true);
    try {
      const finalContent = editorRef.current?.getInstance()?.getMarkdown();

      const finalData = {
        finalTitle: selectedTitle,
        finalContent: finalContent,
        status: 'Complete', // 최종 상태
      };

      // 1️⃣ 최종 글 저장
      await updatePost(inputId, finalData);
      console.log('최종글 저장 완료:', finalData);

      // 2️⃣ 임시 저장 데이터 삭제
      try {
        await deleteTempPost(inputId); // 임시 저장 삭제 API 호출 (예시)
        console.log('임시 저장 데이터 삭제 완료');
      } catch (err) {
        console.warn('임시 저장 삭제 실패:', err);
      }

      // 3️⃣ 보관함으로 이동
      navigate('/storage'); // 보관함 경로
    } catch (err) {
      console.error('최종글 저장 에러:', err);
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
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

  return (
    <BasicLayout>
      <>
        {/* 로딩 오버레이 - 최상위에 배치 */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
            <LoadingPage message={loadingMessage} transparent />
          </div>
        )}

        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
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
        </Dialog>

        <main className="lg:flex-auto lg:min-h-full lg:flex-row-reverse lg:overflow-hidden">
          <h1 className="sr-only">Checkout</h1>

          <section
            aria-labelledby="payment-heading"
            className="relative h-full flex flex-col items-center bg-indigo-950 p-4 pt-10"
          >
            {/* 가로 스태퍼 (xl 이상) */}
            <nav
              aria-label="Progress"
              className="hidden xl:flex w-full max-w-3xl mb-6"
            >
              <ol role="list" className="flex w-full space-x-8">
                {steps.map((step) => (
                  <li key={step.name} className="flex-1">
                    {step.status === 'complete' ? (
                      <Link
                        to={step.href}
                        className="group flex flex-col border-l-4 border-indigo-600 py-2 pl-4 hover:border-indigo-800 md:border-l-0 md:border-t-4 md:pt-4 md:pl-0"
                      >
                        <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-800">
                          {step.name}
                        </span>
                        <span className="text-sm font-medium text-gray-500">
                          {step.description}
                        </span>
                      </Link>
                    ) : step.status === 'current' ? (
                      <Link
                        to={step.href}
                        className="flex flex-col border-l-4 border-indigo-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pt-4 md:pl-0"
                        aria-current="step"
                      >
                        <span className="text-sm font-medium text-indigo-600">
                          {step.name}
                        </span>
                        <span className="text-sm font-medium text-gray-500">
                          {step.description}
                        </span>
                      </Link>
                    ) : (
                      <Link
                        to={step.href}
                        className="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 hover:border-gray-300 md:border-l-0 md:border-t-4 md:pt-4 md:pl-0"
                      >
                        <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                          {step.name}
                        </span>
                        <span className="text-sm font-medium text-gray-500">
                          {step.description}
                        </span>
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>

            {/* 에디터와 오른쪽 버튼 영역 */}
            <div className="flex w-full gap-6 items-start justify-center">
              {/* 가운데 글 미리보기 */}
              <div className="flex-1 max-w-3xl rounded-2xl shadow-lg overflow-hidden">
                <h2 className="text-center text-lg font-semibold mb-4 text-black">
                  최종 글 확인 / 복사하기
                </h2>
                <div className="h-[600px] flex flex-col bg-gray-100 text-gray-900 p-2 rounded-xl">
                  {/* 제목 입력 */}
                  <input
                    type="text"
                    value={selectedTitle}
                    onChange={handleTitleChange}
                    placeholder="제목을 입력하세요"
                    className="w-full text-xl font-semibold border-b border-gray-400 focus:outline-none focus:border-indigo-500 px-2 py-2 mb-2 text-gray-900"
                  />
                  {/* 본문 에디터 */}
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
                        const md = editorRef.current
                          .getInstance()
                          .getMarkdown();
                        setContent(md);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 오른쪽 버튼 영역 */}
              <div className="w-full max-w-xs flex flex-col gap-4">
                <button
                  type="button"
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  onClick={() => setIsOpen(true)}
                >
                  블로그 별 복사 가이드
                </button>

                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  📋 Markdown 복사
                </button>

                <button
                  type="button"
                  onClick={handleCopyHTML}
                  className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                >
                  💾 HTML 복사
                </button>

                <button
                  type="button"
                  onClick={handleCopyPlain}
                  className="w-full px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition"
                >
                  📝 일반 복사
                </button>

                {/* 최종 저장 버튼 */}
                <div className="mt-80 pt-6">
                  <button
                    type="button"
                    onClick={handleFinalSave}
                    disabled={loading}
                    className={`w-full rounded-md bg-green-600 px-4 py-4 text-lg font-semibold text-white hover:bg-green-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? '저장 중...' : '최종 완성 / 보관함으로'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </>
    </BasicLayout>
  );
};

export default Write3;
