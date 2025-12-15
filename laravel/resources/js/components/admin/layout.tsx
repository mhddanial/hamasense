import React from 'react';

import AdminSidebar from './Sidebar';
import { AppShell } from '../app-shell';
import { AppContent } from '../app-content';
import { AppSidebarHeader } from '../app-sidebar-header';
import { Toaster } from 'sonner';
import { BreadcrumbItem } from '@/types';
import { AppSidebar } from '../app-sidebar';

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