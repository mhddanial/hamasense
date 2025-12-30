"use client"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import React from "react"

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

export const DataTableDemo = ({allDatas, checkedDatas, onChange, name}) => {
  console.log(checkedDatas)
  console.log('checkedDatas')

    return (
      
    <>
        <Command className="pb-2">
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {allDatas.map((framework) => (
                <CommandItem
                  key={framework.id}
                  value={String(framework.name)}
                  onSelect={() => {
                   onChange(framework.id) 
                }}
                >
                <input type="checkbox" name={`${name}[]`} id={`plant-${framework.id}`} value={framework.id} checked={checkedDatas.includes(framework.id)}/> 
                  {framework.name}

                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
    </>
    )
}