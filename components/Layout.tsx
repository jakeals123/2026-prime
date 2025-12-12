import React from 'react';
import { ViewMode } from '../types';

interface LayoutProps {
  currentView: ViewMode;
  children: React.ReactNode;
  onChangeView: (view: ViewMode) => void;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, children, onChangeView }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => onChangeView(ViewMode.LANDING)}
            >
              <div className="bg-[#007a33] p-2 rounded-lg mr-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">PRIME' 물품대여</span>
            </div>
            <div className="flex space-x-4">
              {currentView !== ViewMode.LANDING && (
                <button
                  onClick={() => onChangeView(ViewMode.LANDING)}
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {currentView === ViewMode.ADMIN ? '관리자 모드 종료' : '나가기'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} PRIME' Student Council. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};