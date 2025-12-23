import { Link, router, useForm } from "@inertiajs/react";
import { Button } from "../ui/button";
import { Plus, Search } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";

export default function NavSearch({title, href, button_title, page}: {title: string, href: string, button_title: string, page: string}) {
  const { data, setData, get } = useForm({
    keyword: ''
  });

  console.log(page)

  const submit_handler = () => {
    console.log(data.keyword)
    console.log('adasd')

    router.get(route(`admin.${page}.index` , {keyword: data.keyword}));
  }

  return (<>
  <div className="text-gray-900 mb-10">
    <div className="flex items-center justify-between mb-6">
      <div className="flex">
        <SidebarTrigger className="my-auto"/>
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>

      <Link
        href={href}
        className="flex items-center gap-2 bg-green-900 text-white px-6 py-3 rounded-lg 
                  hover:bg-green-800 transition-colors font-medium border border-green-700">
        <Plus className="w-5 h-5" />
        {button_title}
      </Link>
    </div>

    {/* Search Bar */}
    <div className="relative flex gap-2">
      <div className="relative flex-1">
        <Search className="bg-white absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" />

        <input
          type="text"
          placeholder="Cari hama berdasarkan nama, nama ilmiah, atau tanaman ..."
          value={data.keyword}
          onChange={(e) => {
            setData('keyword', e.target.value);
          }}
          className="text-gray-900 bg-white w-full pl-12 pr-4 py-3 rounded-lg
                    bg-neutral-900 placeholder-gray-400
                    border border-green-900 
                    focus:outline-none focus:ring-2 focus:ring-green-700"
        />

      </div>
      <Button className="h-full py-3 my-auto" onClick={submit_handler}>Search</Button>
    </div>

  </div>


    </>);
}