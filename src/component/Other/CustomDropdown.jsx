import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CustomDropdown = ({ 
    label,
    value, 
    onChange, 
    options, 
    disabled = false,
    error = null,
    required = false 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options?.find(opt => opt.value === value);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="w-full" ref={dropdownRef}>
            {label && (
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            
            <div className="relative">
                {/* Trigger Button */}
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className={`flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                        error
                            ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                            : isOpen
                            ? 'border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-900/10'
                            : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-gray-700 dark:text-gray-300`}
                >
                    <span>{selectedOption?.label || 'Select an option'}</span>
                    <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute z-50 mt-2 w-full animate-in fade-in zoom-in-95 duration-200 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-1.5 shadow-xl">
                        {options?.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange({ target: { name: label?.toLowerCase() || 'status', value: option.value } });
                                    setIsOpen(false);
                                }}
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${
                                    value === option.value
                                        ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'
                                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                                }`}
                            >
                                <span>{option.label}</span>
                                {value === option.value && <Check size={14} strokeWidth={3} />}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
        </div>
    );
};

export default CustomDropdown;