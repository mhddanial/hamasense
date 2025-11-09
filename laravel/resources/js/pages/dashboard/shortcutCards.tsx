import {
    ChevronRight,
    Camera,
    Clock8,
    Bug
} from "lucide-react";

const shortcuts = [
    { icon: <Camera />, title: "Deteksi Hama Baru", desc: "Foto tanaman dan dapatkan analisa AI"},
    { icon: <Clock8 />, title: "Lihat Riwayat", desc: "Lihat dan pantau riwayat deteksi"},
    { icon: <Bug />, title: "Pelajari Hama", desc: "Telusuri dan pelajar jenis hama"},
];

export function ShortcutCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {shortcuts.map((item) => (
                <div
                    key={item.title}
                    className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition"
                >
                    <div className="flex justify-between items-center gap-2">
                        <div>{item.icon}</div>
                        <div className="flex-1">
                            <h3 className="font-semibold">
                                {item.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {item.desc}
                            </p>
                        </div>
                        <ChevronRight className="text-gray-400 flex-shrink-0" />
                    </div>
                </div>
            ))}
        </div>
    )
}
