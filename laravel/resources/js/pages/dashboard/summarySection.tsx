export function SummarySection() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CARD 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border">
                <div className="flex-justify-between items-center mb-3">
                    <h4 className="font-semibold">Lanjutkan Perawatan</h4>
                    <button className="text-sm text-emerald-700 dark:text-emerald-400">
                        Lihat Semua
                    </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-10">
                    Tidak ada perawatan yang sedang berlangsung
                </p>
            </div>

            {/* CARD 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex-justify-between items-center mb-3">
                    <h4 className="font-semibold">
                        Ringkasan Riwayat
                    </h4>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-10">
                    Anda belum pernah melakukan deteksi dalam 30 hari terakhir
                </p>
            </div>
        </div>
    )
}