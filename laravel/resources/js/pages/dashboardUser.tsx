import {Head} from '@inertiajs/react';
import {ArticleList} from './dashboard/articleList';
import {AppSidebar} from '@/components/app-sidebar';
import {ShortcutCards} from './dashboard/shortcutCards';
import {SidebarProvider} from '@/components/ui/sidebar';
import {SummarySection} from './dashboard/summarySection';
import {DashboardHeader} from './dashboard/dashboardHeader';
import {WeatherAlertCard} from './dashboard/weatherAlertCard';

export default function Dashboard({user} : {user: {name: string}}) {
    type Article = {
        label: string;
        title: string;
        desc: string
    };

    const articles: Article[] = [
        {
            label: 'Pencegahan',
            title: 'Cara Mencegah Serangan Kutu Daun di Musim Hujan',
            desc: 'Tips praktis...'
        },
        {
            label: 'Edukasi',
            title: 'Mengenal Thrips: Hama Kecil dengan Dampak Besar',
            desc: 'Pelajar cara...'
        },
    ];

    return (
        <SidebarProvider>
            <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">

                {/* SIDEBAR */}
                <aside className="hidden md:block w-64 shrink-0">
                    <AppSidebar/>
                </aside>

                {/* MAIN CONTENT */}
                <div className="flex flex-col basis-0 grow min-w-0">
                    <main className="grow min-w-0 px-4 sm:px-6 md:px-6 md:px-10 lg:px-20 py-6 sm:py-10">
                        <Head title="Beranda"/>

                        {/* Header */}
                        <DashboardHeader user={user}/>

                        {/* Cuaca Card */}
                        <WeatherAlertCard />

                        {/* Shortcut Cards */}
                        <ShortcutCards/>

                        {/* Perawatan dan Ringkasan */}
                        <SummarySection/>

                        {/* Artikel */}
                        <ArticleList articles={articles}/>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}