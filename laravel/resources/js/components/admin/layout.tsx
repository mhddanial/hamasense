import React from 'react';

import { Toaster } from 'sonner';
import AdminSidebar from './Sidebar';
import { AppShell } from '../app-shell';
import { BreadcrumbItem } from '@/types';
import { AppContent } from '../app-content';
import { AppSidebarHeader } from '../app-sidebar-header';

export default function AdminLayout(
  {
        children,
        breadcrumbs = [],
    }: React.PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
  return (
        <>
        <Toaster richColors={false} position="top-center" />
          <AppShell variant="sidebar">
            <AdminSidebar>
              <AppContent variant="sidebar" className="overflow-x-hidden">
                  <AppSidebarHeader breadcrumbs={breadcrumbs} />
                  {children}
              </AppContent>              
            </AdminSidebar>
          </AppShell>
        </>
        
  );
}