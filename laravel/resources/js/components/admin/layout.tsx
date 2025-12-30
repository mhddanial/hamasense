import React from 'react';

import { Toaster } from 'sonner';
import AdminSidebar from './Sidebar';
import { AppShell } from '../app-shell';
import { AppContent } from '../app-content';
import { type BreadcrumbItem } from '@/types';
import { AppSidebarHeader } from '../app-sidebar-header';

export default function AdminLayout(
  {
    children,
    breadcrumbs = [],
  }: React.PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
  return (
    <>
      <Toaster richColors={false} position="top-right" />
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