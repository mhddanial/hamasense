import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';


export default function PestDetails() {
    const breadcrumbs : BreadcrumbItem[] = [
        {
            title: 'Detail Hama',
            href: route('pest.detail')
        },
    ];

    
}