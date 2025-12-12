import React, { useState } from 'react';
import { RentalItem, ItemStatus } from '../types';

interface AdminDashboardProps {
  items: RentalItem[];
  onReturnItem: (id: string) => void;
  onUpdateItem: (item: RentalItem) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ items, onReturnItem, onUpdateItem }) => {
  const [generatedMessage, setGeneratedMessage] = useState<{ id: string, text: string } | null>(null);
  const [editingItem, setEditingItem] = useState<RentalItem | null>(null);

  const handleNotify = (item: RentalItem) => {
    if (!item.renter) return;
    
    // Fixed template as requested
    const message = `안녕하세요! ${item.renter.name}님. 2026 생물학과 학생회 PRIME' 입니다. 물품대여사업 반납 연체 물품('${item.name}')이 있어 안내드립니다. 반납 후 담당자에게 연락 부탁드립니다. 감사합니다.`;
    
    setGeneratedMessage({ id: item.id, text: message });
  };

  const closeMessage = () => setGeneratedMessage(null);

  const copyToClipboard = () => {
    if (generatedMessage) {
      navigator.clipboard.writeText(generatedMessage.text).then(() => {
        alert("텍스트가 복사되었습니다.");
      });
    }
  };

  const handleEditClick = (item: RentalItem) => {
    setEditingItem({ ...item });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      onUpdateItem(editingItem);
      setEditingItem(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">관리자 대시보드</h2>
        <span className="inline-flex rounded-md shadow-sm">
          <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#007a33] hover:bg-[#006229]">
            새 물품 등록
          </button>
        </span>
      </div>

      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">물품 정보</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">대여자 정보</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">반납 예정일</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => {
                     const isOverdue = item.renter && new Date(item.renter.expectedReturnDate) < new Date();
                     return (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.category}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === ItemStatus.AVAILABLE 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.renter ? (
                            <div className="text-sm text-gray-900">
                              <div className="font-medium">{item.renter.name}</div>
                              <div className="text-gray-500 text-xs">{item.renter.contact}</div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.renter ? (
                            <span className={isOverdue ? 'text-red-600 font-bold' : ''}>
                              {new Date(item.renter.expectedReturnDate).toLocaleDateString('ko-KR')}
                              {isOverdue && <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">연체됨</span>}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button 
                            onClick={() => handleEditClick(item)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            수정
                          </button>
                          {item.status === ItemStatus.RENTED && (
                            <>
                              <button 
                                onClick={() => handleNotify(item)}
                                className="text-[#007a33] hover:text-[#006229]"
                              >
                                알림 발송
                              </button>
                              <button 
                                onClick={() => onReturnItem(item.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                반납 처리
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setEditingItem(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <form onSubmit={handleSaveEdit}>
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      물품 정보 수정
                    </h3>
                    <div className="mt-4 space-y-4 text-left">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">물품명</label>
                        <input
                          type="text"
                          id="name"
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#007a33] focus:border-[#007a33] sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">카테고리</label>
                        <input
                          type="text"
                          id="category"
                          value={editingItem.category}
                          onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#007a33] focus:border-[#007a33] sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">설명</label>
                        <textarea
                          id="description"
                          rows={3}
                          value={editingItem.description}
                          onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#007a33] focus:border-[#007a33] sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#007a33] text-base font-medium text-white hover:bg-[#006229] focus:outline-none sm:col-start-2 sm:text-sm"
                  >
                    변경사항 저장
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setEditingItem(null)}
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Generated Message Modal */}
      {generatedMessage && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeMessage}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    반납 알림 메시지 생성
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 text-left bg-gray-50 p-4 rounded-md border border-gray-200">
                      {generatedMessage.text}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      위 텍스트를 복사하여 문자로 전송하세요.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#007a33] text-base font-medium text-white hover:bg-[#006229] focus:outline-none sm:col-start-2 sm:text-sm"
                  onClick={copyToClipboard}
                >
                  텍스트 복사
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={closeMessage}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};