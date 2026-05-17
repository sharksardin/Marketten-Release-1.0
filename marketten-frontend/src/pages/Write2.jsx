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
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

// Toast UI Editor
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import {
  createTempPost,
  updateTempPost,
  generateContent,
  getTempPost,
  analyzeTitleKeywords,
  generateTitles,
} from '../api/tempPostApi';
import { updatePost } from '../api/postApi';
import KeywordAnal from '../component/KeywordAnal';
import { fetchToneList } from '../api/tonelistApi';
import { X } from 'lucide-react';
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
    status: 'current',
  },
  {
    name: '글 복사',
    description: '글을 완성하여 복사하는 단계입니다.',
    href: '/write/3',
    status: 'upcoming',
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Write2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inputId = location.state?.tempPostId;

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [content, setContent] = useState('');
  const [tempPostData, setTempPostData] = useState(null);
  const [postId, setPostId] = useState(null);
  const [keywordList, setKeywordList] = useState([]);
  const [titleList, setTitleList] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [toneList, setToneList] = useState([]);
  const [selectedTone, setSelectedTone] = useState('');
  const [selectedTonePreviewIndex, setSelectedTonePreviewIndex] =
    useState(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    tone: null,
  });

  const [regenerationKeywords, setRegenerationKeywords] = useState([]); // 글 재생성용

  // 유효성 검사 메시지
  const [keywordError, setKeywordError] = useState(''); // 키워드 생성 전용
  const [titleError, setTitleError] = useState(''); // 글 생성 전용
  const [finalSaveError, setFinalSaveError] = useState(''); // 글 생성 전용

  //로딩
  const [loadingMessage, setLoadingMessage] = useState('');

  const editorRef = useRef();

  // --- ( useEffect 및 핸들러 함수들은 이전과 동일 ... 생략 ) ---
  // 1️⃣ 토큰 & 이메일 확인
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const email = localStorage.getItem('email');
    console.log('Header useEffect 실행', token, email);

    const loadTones = async () => {
      try {
        const data = await fetchToneList();
        setToneList(data);

        // Write1에서 저장된 selectedTone을 초기값으로 설정
        const savedTone = tempPostData?.selectedTone;

        // 서버에서 받아온 톤 이름 목록
        const toneNames = data.map((tone) => tone.toneName);

        if (savedTone && toneNames.includes(savedTone)) {
          setSelectedTone(savedTone);
        } else if (data.length > 0) {
          setSelectedTone(data[0].toneName); // 기본값: 첫 번째 톤
        } else {
          setSelectedTone(''); // 톤 리스트가 비어있을 경우 안전하게 초기화
        }
      } catch (err) {
        console.error('톤 리스트 불러오기 실패:', err);
        setToneList([]);
        setSelectedTone('');
      }
    };

    // tempPostData가 null이 아닌 경우에만 실행
    if (tempPostData !== null) {
      loadTones();
    }
  }, [tempPostData]);

  // 2️⃣ 임시 저장 데이터 불러오기
  useEffect(() => {
    if (!inputId) return;

    const fetchTempPost = async () => {
      try {
        const data = await getTempPost(inputId);
        console.log('임시 글 데이터:', data);
        setTempPostData(data);

        setRegenerationKeywords(data.keywordList); // 글 재생성용 키워드 리스트
        // 키워드 설정
        setKeywords([]); // 초기에는 빈 배열
        setKeywordList(data.keywordList || []); // 내부 데이터만 저장

        // 제목 리스트 설정
        setTitleList(data.titleList || []);
        setSelectedTitle(data.selectedTitle || null);

        setPostId(data.postId || null);

        // 에디터 내용 설정
        if (editorRef.current) {
          editorRef.current
            .getInstance()
            .setMarkdown(data.generatedContent || '');
        } else {
          setContent(data.generatedContent || '');
        }
      } catch (err) {
        console.error('Write2 임시 글 로드 에러:', err);
      }
    };

    fetchTempPost();
  }, [inputId]);

  const handleAddKeyword = () => {
    if (inputValue.trim() && !keywords.includes(inputValue.trim())) {
      setKeywords([...keywords, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveKeyword = (kw) =>
    setKeywords(keywords.filter((k) => k !== kw));

  // 본문글 재생성
  const handleRegenerateContent = async () => {
    if (!tempPostData) return;
    setLoadingMessage('AI로 글 재생성 중입니다');
    setLoading(true);
    try {
      //선택된 톤의 tonePreview 찾기
      const selectedToneData = toneList.find(
        (tone) => tone.toneName === selectedTone
      );
      const finalData = {
        productInfo: tempPostData.productInfo || '',
        productFeatures: tempPostData.productFeatures || '',
        userExperience: tempPostData.userExperience || '',
        selectedTone,
        tonePreview: selectedToneData?.tonePreview || '', // tonePreview 추가
        keywords: regenerationKeywords.join(','),
      };

      const result = await generateContent(inputId, finalData);
      console.log('재생성된 본문글:', result);

      const newContent = result.generatedContent || '';
      if (editorRef.current) {
        editorRef.current.getInstance().setMarkdown(newContent);
      }
      setContent(newContent);

      if (result.postId) setPostId(result.postId);

      if (result.postId) {
        const updateFinal = {
          finalContent: newContent,
          status: 'Content',
          finalTone: selectedTone,
        };
        await updatePost(result.postId, updateFinal);
        console.log('재생성 후 최종글 수정 완료:', updateFinal);
      }
    } catch (err) {
      console.error('본문글 재생성 에러:', err);
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  // 제목 키워드 생성
  const handleAnalyzeTitleKeywords = async () => {
    setLoadingMessage('AI로 키워드 생성 중입니다');
    setLoading(true);
    setKeywordError('');
    setTitleError('');
    setFinalSaveError('');

    try {
      const currentContent =
        editorRef.current?.getInstance().getMarkdown() || '';

      // 본문 체크
      if (!currentContent.trim()) {
        setKeywordError('본문 내용을 입력하세요.');
        return;
      }

      if (!inputId) {
        console.error('inputId 없음, 제목 키워드 분석 불가');
        return;
      }

      const analyzed = await analyzeTitleKeywords(inputId, {
        content: currentContent,
      });

      console.log('제목 키워드 분석 결과:', analyzed);

      if (analyzed.keywordList) {
        setKeywordList(analyzed.keywordList);
        setKeywords(analyzed.keywordList.map((k) => k.keywordName));
      }
    } catch (err) {
      console.error('제목 키워드 분석 에러:', err);
    } finally {
      setLoading(false);
      setLoadingMessage('');
      setOpen(true);
    }
  };

  // 제목 리스트 생성
  const handleGenerateTitles = async () => {
    setLoadingMessage('AI로 제목 생성 중입니다');
    setLoading(true);
    setKeywordError('');
    setTitleError('');
    setFinalSaveError('');

    try {
      const currentContent =
        editorRef.current?.getInstance().getMarkdown() || '';

      // 본문 체크
      if (!currentContent.trim()) {
        setTitleError('본문 내용을 입력하세요.');
        return;
      }

      // 키워드 최소 1개 체크
      if (keywords.length === 0) {
        setTitleError('키워드가 최소 1개 이상 필요합니다.');
        return;
      }

      const keywordStr = keywords.join(',');

      const result = await generateTitles(inputId, {
        content: currentContent,
        keywords: keywordStr,
      });

      console.log('제목 생성 결과:', result);
      setTitleList(result.titleList || []);
    } catch (err) {
      console.error('제목 생성 에러:', err);
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  // 최종 저장
  const next = async () => {
    setLoadingMessage('최종 저장 중입니다');
    setLoading(true);
    setKeywordError('');
    setTitleError('');
    setFinalSaveError('');

    try {
      let id = inputId;
      if (!id) {
        const tempPost = await createTempPost({});
        id = tempPost.inputId;
        console.log('새 임시 글 생성, inputId:', id);
      }

      const currentContent =
        editorRef.current?.getInstance().getMarkdown() || '';

      // 본문 체크
      if (!currentContent.trim()) {
        setFinalSaveError('본문 내용을 입력하세요.');
        return;
      }

      // 선택된 제목 체크
      if (!selectedTitle?.titleName) {
        setFinalSaveError('제목을 선택하세요');
        return;
      }

      // 키워드 체크
      if (keywords.length === 0) {
        setFinalSaveError(
          '키워드가 없습니다. 최종 저장하려면 키워드를 최소 1개 이상 포함해야 합니다.'
        );
        return;
      }

      // 1️⃣ 임시 저장 업데이트
      const tempUpdateData = {
        productInfo: tempPostData?.productInfo || '',
        productFeatures: tempPostData?.productFeatures || '',
        userExperience: tempPostData?.userExperience || '',
        selectedTone,
        keywords: keywords.join(','),
        keywordList: keywordList.map((kw) => ({
          keywordName: kw.keywordName,
          averageSearchValue: kw.averageSearchValue || 0,
          peakSearchValue: kw.peakSearchValue || 0,
        })),
        generatedContent: currentContent,
        titleList: titleList.map((t) => ({ titleName: t.titleName })) || [],
        titleKeywords: selectedTitle?.titleName || '', // ✅ 문자열로 보장
        step: 3,
      };

      console.log('최종 저장 - 임시 데이터:', tempUpdateData);
      await updateTempPost(id, tempUpdateData);
      console.log('임시 저장 완료');

      // 2️⃣ 최종 글 업데이트
      if (postId) {
        const finalData = {
          finalContent: currentContent,
          finalTitle: selectedTitle?.titleName || '',
          status: 'FinalReview',
          finalTone: tempPostData?.selectedTone || 'STANDARD',
        };
        console.log('최종 저장 - 최종 글 데이터:', finalData);
        await updatePost(postId, finalData);
        console.log('최종글 저장 완료');
      }

      // 3️⃣ 다음 단계 이동
      navigate('/write/3', { state: { tempPostId: id } });
    } catch (err) {
      console.error('최종 저장 에러:', err.response?.data || err.message);
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  // 임시저장 (Write2용)
  const handleTempSave = async () => {
    setLoadingMessage('저장 중입니다');
    setLoading(true);

    try {
      let id = inputId;
      if (!id) {
        const tempPost = await createTempPost({});
        id = tempPost.inputId;
        console.log('새 임시 글 생성, inputId:', id);
      }

      const updateData = {
        productInfo: tempPostData?.productInfo || '',
        productFeatures: tempPostData?.productFeatures || '',
        userExperience: tempPostData?.userExperience || '',
        selectedTone,
        keywords: keywords.join(',') || '',
        keywordList:
          keywordList?.map((k) => ({
            keywordName: k.keywordName,
            averageSearchValue: k.averageSearchValue || 0,
            peakSearchValue: k.peakSearchValue || 0,
          })) || [],
        generatedContent: editorRef.current?.getInstance().getMarkdown() || '',
        titleList: titleList?.map((t) => ({ titleName: t.titleName })) || [],
        titleKeywords: selectedTitle?.titleName || '', // ✅ 수정된 부분
        step: 2,
      };
      console.log('전송할 임시저장 데이터:', updateData);
      await updateTempPost(id, updateData);
      console.log('임시 저장 완료');

      if (postId) {
        const updateFinal = {
          finalContent: editorRef.current?.getInstance().getMarkdown() || '',
          status: 'Content',
          finalTone: tempPostData?.selectedTone || 'STANDARD',
        };
        await updatePost(postId, updateFinal);
        console.log('최종글 수정 완료:', updateFinal);
      }
    } catch (err) {
      console.error('임시 저장 에러:', err.response?.data || err.message);
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
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
        {/* 모달을 최상위로 이동 */}
        {previewModal.isOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div
              className="bg-white w-full max-w-lg mx-4 max-h-[80vh] flex flex-col 
                rounded-2xl shadow-lg"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {previewModal.tone?.toneName} 미리보기
                </h3>
                <button
                  onClick={() =>
                    setPreviewModal({
                      isOpen: false,
                      tone: null,
                    })
                  }
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="px-6 py-4 overflow-y-auto flex-1">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {previewModal.tone?.tonePreview ||
                    '미리보기 문장이 없습니다.'}
                </p>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() =>
                    setPreviewModal({
                      isOpen: false,
                      tone: null,
                    })
                  }
                  className="rounded-md px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
        <main className="lg:flex-auto lg:min-h-full lg:flex-row-reverse lg:overflow-hidden">
          <h1 className="sr-only">Checkout</h1>

          <KeywordAnal
            open={open}
            setOpen={setOpen}
            keywordList={keywordList}
            setKeywords={setKeywords}
          />

          <section
            aria-labelledby="payment-heading"
            className="relative min-h-screen flex bg-indigo-950 p-4"
          >
            {/* 메인 컨텐츠 영역 (가로 스태퍼 + 에디터 + 오른쪽 폼) */}
            <div className="flex flex-1 flex-col items-center gap-6 mt-10 w-full max-w-7xl mx-auto">
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
              <div className="relative flex w-full gap-6 items-start justify-center">
                {/* 가운데 글 미리보기 */}
                <div className="flex-1 max-w-none rounded-2xl shadow-lg overflow-hidden relative">
                  <div className="absolute  right-4 flex pb-10 items-center gap-2 z-10 ">
                    {/* 글 재생성 버튼 */}
                    <button
                      type="button"
                      onClick={handleRegenerateContent}
                      disabled={loading}
                      className={`rounded-md border border-transparent px-6 py-2 text-sm font-medium shadow-xs focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-hidden
            ${
              loading
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
                    >
                      {loading ? '재생성 중...' : '글 재생성하기'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsInfoOpen(true)}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-red-800 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                    >
                      ?
                    </button>
                  </div>

                  {/* 설명 모달 */}
                  {isInfoOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                      <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
                        {/* 큰 제목 */}
                        <h2 className="text-xl text-gray-800 font-bold mb-4 text-center">
                          주제 설정 페이지 정보
                        </h2>

                        {/* 정보 리스트 */}
                        <ul className="list-disc list-inside text-sm text-gray-700 mb-3 space-y-1">
                          <li>
                            <strong>상품명:</strong>{' '}
                            {tempPostData?.productInfo || '정보 없음'}
                          </li>
                          <li>
                            <strong>상품 특징:</strong>{' '}
                            {tempPostData?.productFeatures || '정보 없음'}
                          </li>
                          <li>
                            <strong>사용자 경험:</strong>{' '}
                            {tempPostData?.userExperience || '정보 없음'}
                          </li>
                          <li>
                            <strong>키워드:</strong>{' '}
                            {regenerationKeywords.length > 0
                              ? regenerationKeywords
                                  .map((kw) => kw.keywordName)
                                  .join(', ')
                              : '정보 없음'}
                          </li>
                          <li>
                            <strong>선택된 톤:</strong>{' '}
                            {selectedTone || '정보 없음'}
                          </li>
                        </ul>

                        {/* 안내 문구 */}
                        <p className="text-sm text-gray-700">
                          위 정보를 기반으로 글이 자동으로 재생성됩니다.
                        </p>

                        {/* 닫기 버튼 */}
                        <button
                          onClick={() => setIsInfoOpen(false)}
                          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}

                  <h2 className="text-center text-lg font-semibold mb-4 text-black">
                    글 작성 / 미리보기
                  </h2>
                  <div className="h-[70vh] flex flex-col">
                    <div className="flex-1 bg-gray-100 text-gray-900 p-2 rounded-xl">
                      {' '}
                      {/* rounded-xl로 변경 */}
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

                {/* 오른쪽 입력 폼 */}
                <div className="w-full max-w-md">
                  <div className="bg-indigo-950 p-6 rounded-lg shadow-md max-h-[calc(100vh-10rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-800">
                    {' '}
                    {/* max-h 조절 */}
                    <form className="space-y-6">
                      <div className="grid grid-cols-12 gap-x-4 gap-y-6">
                        {/* 🔹 옵션 섹션 */}
                        <div className="relative col-span-full border border-gray-600 rounded-lg p-4 mt-6">
                          <span className="absolute -top-3 left-4 bg-white px-2 text-sm font-semibold text-gray-800">
                            글의 톤 선택
                          </span>

                          {toneList.map((tone, idx) => (
                            <div
                              key={tone.toneId}
                              className="flex flex-col w-full mt-3 bg-white rounded-md px-3 py-2 shadow-sm border border-gray-200"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <input
                                    type="radio"
                                    name="tone"
                                    id={`tone-${tone.toneId}`}
                                    value={tone.toneName}
                                    checked={selectedTone === tone.toneName}
                                    onChange={() =>
                                      setSelectedTone(tone.toneName)
                                    }
                                    className="size-4 accent-indigo-600"
                                  />
                                  <label
                                    htmlFor={`tone-${tone.toneId}`}
                                    className="text-black text-sm"
                                  >
                                    {tone.toneName}
                                  </label>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setPreviewModal({ isOpen: true, tone })
                                  }
                                  className="rounded-md bg-gray-200 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300"
                                >
                                  미리보기
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 🔹 1단계: 키워드 생성/추가 */}
                      <div className="relative border border-black rounded-lg p-4 mt-6 space-y-4">
                        <span className="absolute -top-3 left-4 bg-white px-2 text-sm font-semibold text-gray-800">
                          1단계
                        </span>

                        {/* 본문 기반 키워드 생성 유효성 메시지 */}
                        {keywordError && (
                          <div className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded border border-red-200">
                            {keywordError}
                          </div>
                        )}

                        {/* 키워드 생성 버튼 영역 */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setOpen(true)}
                            type="button"
                            className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-xs
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}
              focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-hidden`}
                            disabled={loading}
                          >
                            키워드 분석 열기
                          </button>

                          <button
                            type="button"
                            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium text-white shadow-xs
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}
              focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-hidden`}
                            onClick={handleAnalyzeTitleKeywords}
                            disabled={loading}
                          >
                            {loading ? '분석 중...' : '본문 기반 키워드 생성'}
                          </button>
                        </div>

                        {/* 키워드 추가 입력 */}
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            키워드 추가
                          </label>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              placeholder="키워드를 입력하세요"
                              className="flex-grow rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                            />
                            <button
                              type="button"
                              onClick={handleAddKeyword}
                              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-hidden"
                            >
                              추가
                            </button>
                          </div>

                          {/* 키워드 리스트 */}
                          <div className="mt-4 flex flex-wrap gap-2">
                            {keywords.length > 0 ? (
                              keywords.map((kw, idx) => (
                                <span
                                  key={`${kw}-${idx}`}
                                  className="flex items-center gap-1 bg-indigo-700 text-white text-sm px-3 py-1 rounded-full"
                                >
                                  {kw}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveKeyword(kw)}
                                    className="text-gray-200 hover:text-red-300"
                                  >
                                    <XMarkIcon className="w-5 h-5" />
                                  </button>
                                </span>
                              ))
                            ) : (
                              <p className="text-gray-400 text-sm">
                                아직 추가된 키워드가 없습니다.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 🔹 2단계: 제목 생성 */}
                      <div className="relative mt-6 border border-black rounded-lg p-4">
                        <span className="absolute -top-3 left-4 bg-white px-2 text-sm font-semibold text-gray-800">
                          2단계
                        </span>

                        <h3 className="text-center text-gray font-semibold mb-4">
                          키워드 기반 제목 생성
                        </h3>

                        <div className="flex flex-col gap-3">
                          {titleList.map((title) => (
                            <label
                              key={title.titleId}
                              className="flex items-center justify-between bg-gray-300 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100"
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="titleOption"
                                  className="size-4 accent-indigo-500"
                                  checked={
                                    selectedTitle?.titleId === title.titleId
                                  }
                                  onChange={() => setSelectedTitle(title)}
                                />
                                <span className="text-sm text-black">
                                  {title.titleName}
                                </span>
                              </div>
                            </label>
                          ))}
                        </div>

                        {/* 제목 유효성 */}
                        {titleError && (
                          <div className="mb-2 text-sm text-red-600 bg-red-50 px-3 py-1 rounded border border-red-200">
                            {titleError}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={handleGenerateTitles}
                          className={`mt-4 w-full rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-xs
          ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}
          focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-hidden`}
                          disabled={loading}
                        >
                          {loading ? '생성 중...' : '제목 생성'}
                        </button>
                      </div>
                    </form>
                    {finalSaveError && (
                      <div className="mb-2 text-sm text-red-600 bg-red-50 px-3 py-1 rounded border border-red-200">
                        {finalSaveError}
                      </div>
                    )}
                    <div className="flex shrink-0 gap-5 justify-end py-2">
                      <button
                        type="button"
                        onClick={handleTempSave}
                        disabled={loading}
                        className={`mt-6 w-full rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-xs focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400 text-black'}`}
                      >
                        {loading ? '저장 중...' : '저장'}
                      </button>
                      <button
                        type="button"
                        onClick={next}
                        disabled={loading}
                        className={`mt-6 w-full rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-xs ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-hidden`}
                      >
                        {loading ? '저장 중...' : '최종 저장'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </>
    </BasicLayout>
  );
};

export default Write2;
