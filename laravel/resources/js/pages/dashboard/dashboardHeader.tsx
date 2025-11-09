export function DashboardHeader({ user }: { user: { name: string } }) {
    return (
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div>
                <h1 className="text-xl sm:tex-2xl font-bold">
                    Selamat Datang, {user.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    Pantau kesehatan tanaman anda dengan teknologi AI terdepan
                </p>
            </div>
        </div>
    )
}