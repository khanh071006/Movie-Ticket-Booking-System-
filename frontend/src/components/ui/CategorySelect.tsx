import { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import { apiClient, parseError } from '../../api/axiosClient';

type Kind = 'directors' | 'genres' | 'movie-statuses' | 'cast-members' | 'states' | 'snack-types';

interface CategorySelectProps {
    kind: Kind;
    isMulti?: boolean;
    value: string | string[];
    onChange: (value: any) => void;
    placeholder?: string;
}

export const CategorySelect = ({ kind, isMulti = false, value, onChange, placeholder }: CategorySelectProps) => {
    const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadOptions();
    }, [kind]);

    const loadOptions = async () => {
        setIsLoading(true);
        try {
            const data = await apiClient.categories.getAll(kind);
            setOptions(data.map(item => ({ label: item.name, value: item.id })));
        } catch (error) {
            console.error('Failed to load categories', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (inputValue: string) => {
        setIsLoading(true);
        try {
            const newItem = await apiClient.categories.create(kind, { name: inputValue });
            const newOption = { label: newItem.name, value: newItem.id };
            setOptions((prev) => [...prev, newOption]);

            if (isMulti) {
                const currentValue = Array.isArray(value) ? value : [];
                onChange([...currentValue, newOption.value]);
            } else {
                onChange(newOption.value);
            }
        } catch (error) {
            console.error('Failed to create category', error);
            alert(parseError(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (newValue: any) => {
        if (isMulti) {
            onChange(newValue ? newValue.map((v: any) => v.value) : []);
        } else {
            onChange(newValue ? newValue.value : '');
        }
    };

    const currentValue = isMulti
        ? options.filter((opt) => (value as string[]).includes(opt.value))
        : options.find((opt) => opt.value === value) || null;

    return (
        <CreatableSelect
            isMulti={isMulti}
            isClearable={true}
            isDisabled={isLoading}
            isLoading={isLoading}
            onChange={handleChange}
            onCreateOption={handleCreate}
            options={options}
            value={currentValue}
            placeholder={placeholder || 'Chọn hoặc gõ để thêm mới...'}
            formatCreateLabel={(inputValue) => `Tạo mới "${inputValue}"`}
            noOptionsMessage={() => 'Không có lựa chọn nào'}
            styles={{
                control: (base, state) => ({
                    ...base,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: state.isFocused ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: state.isFocused ? '0 0 0 1px rgba(59, 130, 246, 0.2)' : 'none',
                    '&:hover': {
                        borderColor: state.isFocused ? '#3b82f6' : 'rgba(255, 255, 255, 0.2)',
                    },
                    minHeight: '48px',
                    borderRadius: '0.375rem',
                }),
                menu: (base) => ({
                    ...base,
                    backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    zIndex: 50,
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    color: state.isFocused ? '#60a5fa' : '#cbd5e1',
                    cursor: 'pointer',
                    '&:active': {
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    },
                }),
                singleValue: (base) => ({
                    ...base,
                    color: 'white',
                }),
                multiValue: (base) => ({
                    ...base,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '4px',
                }),
                multiValueLabel: (base) => ({
                    ...base,
                    color: '#3b82f6',
                }),
                multiValueRemove: (base) => ({
                    ...base,
                    color: '#3b82f6',
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        color: '#ef4444',
                    },
                }),
                input: (base) => ({
                    ...base,
                    color: 'white',
                }),
            }}
        />
    );
};
