import React from 'react';

interface SearchBarButton {
    value: string;
    onChange: (value:string) => void;
}

const SearchBar: React.FC<SearchBarButton> = ({value, onChange}) => {
    return (
        <input
            type="text"
            placeholder="Cari hama berdasarkan nama, nama ilmiah, atau tanaman..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-green-600"
        />
    )
}

export default SearchBar;
