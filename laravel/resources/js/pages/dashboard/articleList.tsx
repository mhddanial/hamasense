type Article = {
    label: string;
    title: string;
    desc: string;
}

export function ArticleList({ articles }: { articles: Article[] }) {
    return (
        <>
            <div className="flex flex-wrap justify-between items-center mb-3">
                <h4 className="font-semibold">Lihat Artikel</h4>
                <button className="text-sm text-emerald-700">
                    Lihat Semua
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {articles.map((article) => (
                    <div
                        key={article.title}
                        className="bg-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row gap-4"
                    >
                        <img
                            src="#"
                            alt="article"
                            className="rounded-lg w-full sm:w-24 sm:h-24 object-cover"
                        />
                        <div>
                            <span className="text-xs bg-gray-200 px-2 py-0 5 rounded-full">
                                {article.label}
                            </span>
                            <h5 className="font-semibold mt-1">
                                {article.title}
                            </h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                {article.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}