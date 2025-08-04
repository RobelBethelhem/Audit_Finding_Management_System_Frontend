import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropdownOption {
  id: string;
  name: string;
  description?: string;
}

interface SearchableDropdownProps {
  options: DropdownOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  value,
  onValueChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  loading = false,
  disabled = false,
  className = ""
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedOption = options.find(option => option.id === value);
  
  const filteredOptions = options.filter(option =>
    option?.name?.toLowerCase()?.includes(search.toLowerCase()) ?? false
  );

  const handleSelect = (optionId: string) => {
    onValueChange(optionId);
    setOpen(false);
    setSearch('');
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearch('');
    }
  };

  return (
    <Popover open={open && !loading} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={loading || disabled}
        >
          {selectedOption ? selectedOption.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        {!loading && Array.isArray(options) && options.length > 0 ? (
          <div className="max-h-60 overflow-auto">
            <div className="p-2">
              <Input
                placeholder={searchPlaceholder}
                className="mb-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              {filteredOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(option.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{option.name}</div>
                    {option.description && (
                      <div className="text-sm text-gray-500">{option.description}</div>
                    )}
                  </div>
                </div>
              ))}
              {filteredOptions.length === 0 && search && (
                <div className="px-3 py-2 text-sm text-gray-500">
                  {emptyMessage}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-gray-500">
            {loading ? "Loading..." : `No ${emptyMessage.toLowerCase()}`}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

// Helper function to transform reference data to dropdown options
export const transformToDropdownOptions = (
  items: any[],
  nameField: string,
  descriptionField?: string
): DropdownOption[] => {
  return items.map(item => ({
    id: item.id,
    name: item[nameField],
    description: descriptionField ? item[descriptionField] : undefined
  }));
};
