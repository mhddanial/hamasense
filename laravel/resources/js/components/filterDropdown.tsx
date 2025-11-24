import React from 'react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface filterDropdownProps {
    options: string[];
    value: string;
    onChange: (value:string) => void;
}

const FilterDropdown: React.FC<filterDropdownProps> = ({options, value, onChange}) => {
    return (
        <div className="flex items-center">
            <DropdownMenu>
                <DropdownMenuTrigger className="flex justify-between border rounded-lg px-3 py-2 text-left min-w-[170px] items-center focus:outline-none">
                    {value}
                    <span className="ml-2">▾</span>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                    {options.map((item) => (
                        <DropdownMenuItem
                            key={item}
                            onSelect={() => onChange(item)}
                            className="cursor-pointer"
                        >
                            {item}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default FilterDropdown;
