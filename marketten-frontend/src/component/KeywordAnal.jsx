import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

const KeywordAnal = ({ open, setOpen, keywordList, setKeywords }) => {
  const [localSelected, setLocalSelected] = useState([]);

  // keywordList가 바뀌면 localSelected 초기화
  useEffect(() => {
    if (keywordList && keywordList.length > 0) {
      setLocalSelected(keywordList.map((kw) => kw.keywordName));
    } else {
      setLocalSelected([]);
    }
  }, [keywordList]);

  const handleCheckboxChange = (kwName, checked) => {
    if (checked) {
      setLocalSelected([...localSelected, kwName]);
    } else {
      setLocalSelected(localSelected.filter((k) => k !== kwName));
    }
  };

  const handleAddKeywords = () => {
    setKeywords(localSelected); // 부모 상태에 반영
    setOpen(false); // 모달 닫기
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-50"
    >
      <section className="hidden w-full max-w-md flex-col bg-gray-50 lg:flex border-l border-gray-200">
        <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out">
                <div className="flex h-full flex-col bg-white shadow-xl">
                  <div className="flex items-center justify-between bg-indigo-600 px-4 py-4 sm:px-6">
                    <DialogTitle className="text-base font-semibold text-white">
                      키워드 추이 분석 결과
                    </DialogTitle>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-md text-indigo-200 hover:text-white"
                    >
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <fieldset className="p-6">
                    <legend className="text-sm font-semibold text-gray-900 pt-10">
                      키워드 선택
                    </legend>
                    <div className="mt-4 divide-y divide-gray-200 border-t border-b border-gray-200">
                      {keywordList.length > 0 ? (
                        keywordList.map((kw) => (
                          <div
                            key={kw.keywordId}
                            className="relative flex gap-3 py-4"
                          >
                            <div className="min-w-0 flex-1 text-sm">
                              <label
                                htmlFor={`keyword-${kw.keywordId}`}
                                className="font-medium text-gray-900 select-none"
                              >
                                {kw.keywordName} (평균: {kw.averageSearchValue},
                                최고: {kw.peakSearchValue})
                              </label>
                            </div>
                            <div className="flex h-6 shrink-0 items-center">
                              <input
                                id={`keyword-${kw.keywordId}`}
                                type="checkbox"
                                checked={localSelected.includes(kw.keywordName)}
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    kw.keywordName,
                                    e.target.checked
                                  )
                                }
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 py-4 text-sm">
                          분석된 키워드가 없습니다.
                        </p>
                      )}
                    </div>
                  </fieldset>

                  <button
                    type="button"
                    className="rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 m-4"
                    onClick={handleAddKeywords}
                  >
                    추가 완료
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </section>
    </Dialog>
  );
};

export default KeywordAnal;
