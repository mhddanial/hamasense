import React from 'react';

import AdminSidebar from './Sidebar';
import { AppShell } from '../app-shell';
import { AppContent } from '../app-content';

export default function AdminLayout({children, page_title}: {children: React.ReactNode, page_title: string}) {
  return (
        <>
        <AppShell variant='sidebar'>
          <AdminSidebar>
          <AppContent variant='sidebar' className='overflow-x-hidden'>
          {/* Content */}

            <div className='bg-gray-200 min-h-full'>
              <div className='m-5 rounded-lg shadow-xl bg-white p-5'>
                  {children}
              </div>
            </div>

            </AppContent>
          </AdminSidebar>
        </AppShell>
        </>
        
  );
}