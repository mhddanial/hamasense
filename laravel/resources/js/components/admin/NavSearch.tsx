import { Plus } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function NavSearch({title, href, button_title, page, search}: {title: string, href: string, button_title: string, page: string, search?: string}) {

  return (<>
  <div className="text-gray-900 mb-10">
    <div className="flex items-center justify-between mb-6">
      <div className="flex">
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
  </div>


</>);
}