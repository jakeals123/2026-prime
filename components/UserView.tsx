import React, { useState } from 'react';
import { RentalItem, ItemStatus, RenterInfo } from '../types';
import { DEFAULT_RENTAL_DAYS } from '../constants';

interface UserViewProps {
  items: RentalItem[];
  onRentItem: (itemId: string, renterInfo: RenterInfo) => void;
}

export const UserView: React.FC<UserViewProps> = ({ items, onRentItem }) => {
  const [selectedItem, setSelectedItem] = useState<RentalItem | null>(null);
  const [renterName, setRenterName] = useState('');
  const [renterContact, setRenterContact] = useState('');
  const [isPeriodChecked, setIsPeriodChecked] = useState(false);
  const [isReturnNotifyChecked, setIsReturnNotifyChecked] = useState(false);
  const [successModal, setSuccessModal] = useState<{ date: string, itemName: string } | null>(null);

  const handleCardClick = (item: RentalItem) => {
    if (item.status === ItemStatus.AVAILABLE) {
      setSelectedItem(item);
    }
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setRenterName('');
    setRenterContact('');
    setIsPeriodChecked(false);
    setIsReturnNotifyChecked(false);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    setRenterContact(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem && renterName && renterContact && isPeriodChecked && isReturnNotifyChecked) {
      const now = new Date();
      const returnDate = new Date(now.getTime() + DEFAULT_RENTAL_DAYS * 24 * 60 * 60 * 1000);
      
      const renterInfo: RenterInfo = {
        name: renterName,
        contact: renterContact,
        rentDate: now.toISOString(),
        expectedReturnDate: returnDate.toISOString(),
      };

      onRentItem(selectedItem.id, renterInfo);
      
      setSuccessModal({
        date: returnDate.toLocaleDateString('ko-KR'),
        itemName: selectedItem.name
      });
      
      handleCloseModal();
    }
  };

  const isFormValid = renterName && renterContact && isPeriodChecked && isReturnNotifyChecked;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">대여 물품</h2>
        <p className="mt-2 text-sm text-gray-600">대여가능 여부를 확인 후에 대여자 정보를 입력하고 물품을 대여하시면 됩니다.</p>
        <p className="mt-1 text-sm font-bold text-[#007a33]">관리자 연락처: 010-9159-4215 (김경민)</p>
      </div>

      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`group relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between ${item.status === ItemStatus.AVAILABLE ? 'cursor-pointer' : 'opacity-75 cursor-not-allowed'}`}
            onClick={() => handleCardClick(item)}
            style={{ minHeight: '200px' }}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                 <h3 className="text-xl font-bold text-gray-900">
                  {item.name}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.status === ItemStatus.AVAILABLE ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              </div>
              <p className="text-sm font-medium text-[#007a33] mb-2">{item.category}</p>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">{item.description}</p>
            </div>
              
            <div className="mt-4">
              {item.status === ItemStatus.AVAILABLE ? (
                <button className="w-full bg-[#007a33] border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-[#006229] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007a33]">
                  대여하기
                </button>
              ) : (
                <button disabled className="w-full bg-gray-100 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-gray-400 cursor-not-allowed">
                  현재 대여 불가
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Rent Modal */}
      {selectedItem && (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleCloseModal}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <form onSubmit={handleSubmit}>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {selectedItem.name} 대여
                  </h3>
                  <div className="mt-2 text-sm text-gray-500 mb-4">
                    물품을 대여하기 위해 대여자 정보를 입력해주세요.
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">이름</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#007a33] focus:border-[#007a33] sm:text-sm"
                        value={renterName}
                        onChange={(e) => setRenterName(e.target.value)}
                        placeholder="홍길동"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact" className="block text-sm font-medium text-gray-700">연락처 (ex. 01012345678)</label>
                      <input
                        type="tel"
                        name="contact"
                        id="contact"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#007a33] focus:border-[#007a33] sm:text-sm"
                        value={renterContact}
                        onChange={handleContactChange}
                        placeholder="01012345678"
                        pattern="[0-9]*"
                      />
                    </div>
                    <div className="bg-green-50 p-3 rounded-md">
                      <p className="text-sm text-[#007a33]">
                        <strong>기본 대여 기간:</strong> {DEFAULT_RENTAL_DAYS}일
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="period-check"
                            name="period-check"
                            type="checkbox"
                            required
                            checked={isPeriodChecked}
                            onChange={(e) => setIsPeriodChecked(e.target.checked)}
                            className="focus:ring-[#007a33] h-4 w-4 text-[#007a33] border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="period-check" className="font-medium text-gray-700">대여 기간을 확인하셨나요?</label>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="return-notify-check"
                            name="return-notify-check"
                            type="checkbox"
                            required
                            checked={isReturnNotifyChecked}
                            onChange={(e) => setIsReturnNotifyChecked(e.target.checked)}
                            className="focus:ring-[#007a33] h-4 w-4 text-[#007a33] border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="return-notify-check" className="font-medium text-gray-700">반납 후 관리자 연락처를 통해 물품 반납을 알려주세요. (관리자 연락처: 010-9159-4215)</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none sm:col-start-2 sm:text-sm ${
                      isFormValid 
                        ? 'bg-[#007a33] hover:bg-[#006229]' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    대여하기
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={handleCloseModal}
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSuccessModal(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-[#007a33]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">대여 완료!</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      <strong>{successModal.itemName}</strong> 대여가 성공적으로 처리되었습니다.
                    </p>
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-[#007a33]">반납 예정일:</p>
                      <p className="text-2xl font-bold text-[#007a33]">{successModal.date}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#007a33] text-base font-medium text-white hover:bg-[#006229] focus:outline-none sm:text-sm"
                  onClick={() => setSuccessModal(null)}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};