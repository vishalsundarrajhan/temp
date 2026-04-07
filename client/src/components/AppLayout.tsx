import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AppLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Sidebar />
      <main className="flex-1 ml-[60px] lg:ml-[240px] transition-all p-6 min-w-0">
        <Outlet />
      </main>
      <style>{`
        @media (max-width: 767px) {
          main { margin-left: 0; padding-top: 70px; }
        }
      `}</style>
    </div>
  );
};

export default AppLayout;
