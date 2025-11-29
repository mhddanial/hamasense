import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarButton {
    value: string;
    onChange: (value:string) => void;
}

const SearchBar: React.FC<SearchBarButton> = ({value, onChange}) => {
    return (
        <div className="relative w-full">
            <Search className="absolute left-3 top-4.5 -translate-y-1/2 text-gray-500" />
            <Input
                placeholder="Cari hama berdasarkan nama, nama ilmiah, atau tanaman"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-12"
            />
        </div>
    )
}

export default SearchBar;
