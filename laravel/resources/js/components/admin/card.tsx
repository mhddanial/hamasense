

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "../ui/button";
import { Link } from "@inertiajs/react";
import { Edit2, Eye, Trash2 } from "lucide-react";

export function ItemHeaderDemo({id, name, img_path, scientific_name,  delete_onclick, filename, slug}: {id:number, name: string, img_path: string, scientific_name:string, delete_onclick: any, filename: string, slug:string}) {
  
  console.log(img_path)
  return (
              <div key={id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={`/storage/${img_path}/${filename}`}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                  {/* <span className="absolute top-3 right-3 bg-white text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                    {tanaman.kategori}
                  </span> */}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{name}</h3>
                      <p className="text-sm text-gray-600 italic">{scientific_name}</p>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <Link href={`/admin/${img_path}/${slug}`} className="text-gray-600 hover:text-teal-600 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button onClick={delete_onclick} className="text-gray-600 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* <p className="text-sm text-gray-500 mb-4">{tanaman.detail}</p> */}

                  {/* Tags */}
                  {/* <div className="flex flex-wrap gap-2 mb-4">
                    {tanaman.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div> */}

                  {/* Button */}
                  <button className="w-full flex items-center justify-center gap-2 bg-teal-700 text-white py-2.5 rounded-lg hover:bg-teal-800 transition-colors font-medium">
                    <Eye className="w-4 h-4" />
                    Lihat Detail
                  </button>
                </div>
              </div>
    
    // <Item key={name} variant="outline">
    //     <ItemHeader>
    //         <img className='w-full h-60 object-cover' src={filename ? `/storage/${img_path}/${filename}` : 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png'} alt={name} />

    //         </ItemHeader>
    //         <ItemContent>
    //             <ItemTitle>{name}</ItemTitle>
    //             <ItemDescription>{scientific_name}</ItemDescription>

    //             <div className="flex flex-col w-full mt-4 gap-2">

    //               <Link className='w-full' href={`/admin/${img_path}/${id}`}>
    //                   <Button className='w-full' variant='default'>Edit data</Button>
    //               </Link>
    //               <Button className="w-full" onClick={() => {
    //                 delete_onclick()
    //               }} variant='destructive'>Delete data</Button>

    //             </div>
              
    //           </ItemContent>
    //         </Item>
  )
}
