import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { UserView } from './components/UserView';
import { AdminDashboard } from './components/AdminDashboard';
import { RentalItem, ItemStatus, RenterInfo, ViewMode } from './types';
import { INITIAL_ITEMS } from './constants';

export default function App() {
  const [items, setItems] = useState<RentalItem[]>(INITIAL_ITEMS);
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.LANDING);
  
  // Admin Login State
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCodeInput, setAdminCodeInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // User Actions
  const handleRentItem = (itemId: string, renterInfo: RenterInfo) => {
    setItems(prevItems => prevItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          status: ItemStatus.RENTED,
          renter: renterInfo
        };
      }
      return item;
    }));
  };

  // Admin Actions
  const handleReturnItem = (itemId: string) => {
    setItems(prevItems => prevItems.map(item => {
      if (item.id === itemId) {
        // Remove renter info and set status to available
        const { renter, ...rest } = item;
        return {
          ...rest,
          status: ItemStatus.AVAILABLE,
        };
      }
      return item;
    }));
  };

  const handleUpdateItem = (updatedItem: RentalItem) => {
    setItems(prevItems => prevItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  const verifyAdminCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCodeInput === '2026prime') {
      setCurrentView(ViewMode.ADMIN);
      setShowAdminLogin(false);
      setAdminCodeInput('');
      setLoginError('');
    } else {
      setLoginError('코드가 올바르지 않습니다.');
    }
  };

  const openAdminLogin = () => {
    setShowAdminLogin(true);
    setLoginError('');
    setAdminCodeInput('');
  };

  // Landing Page
  if (currentView === ViewMode.LANDING) {
    return (
      <div className="min-h-screen bg-[#007a33] flex flex-col justify-center items-center p-4 relative">
        <div className="flex-grow flex flex-col justify-center items-center w-full max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">PRIME' 물품대여</h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-2xl mx-auto font-medium">
              2026 생물학과 학생회 PRIME' 물품대여사업
            </p>
          </div>
          
          <div className="w-full max-w-md">
            <button 
              onClick={() => setCurrentView(ViewMode.USER)}
              className="w-full bg-white text-[#007a33] rounded-2xl p-6 hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center group"
            >
              <span className="text-3xl font-bold">대여하기</span>
              <svg className="w-8 h-8 ml-3 text-[#007a33] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Admin Link - Hidden at bottom */}
        <div className="absolute bottom-8">
          <button 
            onClick={openAdminLogin}
            className="text-green-800 hover:text-green-900 text-sm transition-colors duration-300 font-medium"
          >
            관리자
          </button>
        </div>

        {/* Admin Login Modal */}
        {showAdminLogin && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" onClick={() => setShowAdminLogin(false)}></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                <form onSubmit={verifyAdminCode}>
                  <div>
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                      <svg className="h-6 w-6 text-[#007a33]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        관리자 접근 코드 입력
                      </h3>
                      <div className="mt-2">
                        <input
                          type="password"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#007a33] focus:border-[#007a33] sm:text-sm"
                          placeholder="코드를 입력하세요"
                          value={adminCodeInput}
                          onChange={(e) => setAdminCodeInput(e.target.value)}
                          autoFocus
                        />
                        {loginError && <p className="mt-2 text-sm text-red-600">{loginError}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#007a33] text-base font-medium text-white hover:bg-[#006229] focus:outline-none sm:col-start-2 sm:text-sm"
                    >
                      확인
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm"
                      onClick={() => setShowAdminLogin(false)}
                    >
                      취소
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Application Layout
  return (
    <Layout currentView={currentView} onChangeView={setCurrentView}>
      {currentView === ViewMode.ADMIN && (
        <AdminDashboard 
          items={items} 
          onReturnItem={handleReturnItem} 
          onUpdateItem={handleUpdateItem}
        />
      )}
      
      {currentView === ViewMode.USER && (
        <UserView 
          items={items} 
          onRentItem={handleRentItem} 
        />
      )}
    </Layout>
  );
}