import React from 'react';

interface filterDropdownProps {
    options: string[];
    value: string;
    onChange: (value:string) => void;
}

const FilterDropdown: React.FC<filterDropdownProps> = ({options, value, onChange}) => {
    return (
        <div className="flex items-center gap-2">
            <select
                className='border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600'
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((item) => (
                    <option key={item} value={item}>
                        {item}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FilterDropdown;
