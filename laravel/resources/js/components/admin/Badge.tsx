import { CircleX } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function BadgeDemo({checkedItems, allItems, onClick } : {checkedItems: any[], allItems: any[], onClick: (id: number) => any}) {
  
  console.log('checkedItems')
  console.log(checkedItems)
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex w-full flex-wrap gap-2">
        {
            checkedItems.map((item) => 
                <Badge className="rounded-4xl" variant={'default'}> {allItems.find((i) => i.id === item).name} <button onClick={() => {onClick(item)}}> <CircleX className="hover:bg-red-800 rounded-full" /></button></Badge>
            )
        }
        {/* <Badge className="rounded-4xl" variant={'default'}>Badge <button onClick={() => {onClick()}}><CircleX className="hover:bg-red-800 rounded-full" /></button></Badge> */}
      </div>
    </div>
  )
}
