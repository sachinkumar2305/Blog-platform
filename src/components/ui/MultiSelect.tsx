import { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface MultiSelectProps {
  label?: string;
  options: { label: string; value: string | number }[];
  value?: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  label,
  options,
  value = [],
  onChange,
  placeholder = 'Select options',
  className = '',
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string | number) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

    const removeValue = (optionValue: string | number, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <button
        type="button"
        className="w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm min-h-[38px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="block truncate">
          {selectedOptions.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-sm flex items-center gap-1"
                >
                  {option.label}
                  <XMarkIcon
                    className="h-4 w-4 hover:text-blue-600 cursor-pointer"
                    onClick={(e: React.MouseEvent<HTMLElement>) => removeValue(option.value, e)}
                  />
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
        </span>
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {options.map((option) => (
            <li
              key={option.value}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 ${
                value.includes(option.value) ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
              }`}
              onClick={() => handleSelect(option.value)}
            >
              <span className="block truncate">{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}