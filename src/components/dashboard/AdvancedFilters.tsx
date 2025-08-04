import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Filter,
  X,
  ChevronDown,
  Save,
  FolderOpen,
  Plus,
  Trash2
} from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterConfig {
  departments: FilterOption[];
  riskLevels: FilterOption[];
  statuses: FilterOption[];
  categories: FilterOption[];
  users: FilterOption[];
}

export interface ActiveFilters {
  departments: string[];
  riskLevels: string[];
  statuses: string[];
  categories: string[];
  assignedUsers: string[];
  createdBy: string[];
  amountRange: { min?: number; max?: number };
  logicOperator: 'AND' | 'OR';
}

export interface FilterPreset {
  id: string;
  name: string;
  filters: ActiveFilters;
  createdAt: Date;
}

interface AdvancedFiltersProps {
  filterConfig: FilterConfig;
  activeFilters: ActiveFilters;
  onFiltersChange: (filters: ActiveFilters) => void;
  onPresetSave: (preset: Omit<FilterPreset, 'id' | 'createdAt'>) => void;
  onPresetLoad: (preset: FilterPreset) => void;
  presets: FilterPreset[];
  resultCount?: number;
  isLoading?: boolean;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filterConfig,
  activeFilters,
  onFiltersChange,
  onPresetSave,
  onPresetLoad,
  presets,
  resultCount,
  isLoading = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [showPresetInput, setShowPresetInput] = useState(false);

  // Update filters helper
  const updateFilters = (updates: Partial<ActiveFilters>) => {
    onFiltersChange({ ...activeFilters, ...updates });
  };

  // Multi-select filter component
  const MultiSelectFilter = ({ 
    label, 
    options, 
    selectedValues, 
    onChange 
  }: {
    label: string;
    options: FilterOption[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`${label}-${option.value}`}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onChange([...selectedValues, option.value]);
                } else {
                  onChange(selectedValues.filter(v => v !== option.value));
                }
              }}
            />
            <Label 
              htmlFor={`${label}-${option.value}`}
              className="text-sm flex-1 cursor-pointer"
            >
              {option.label}
              {option.count && (
                <Badge variant="secondary" className="ml-2">
                  {option.count}
                </Badge>
              )}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );

  // Active filters display
  const getActiveFilterCount = () => {
    return (
      activeFilters.departments.length +
      activeFilters.riskLevels.length +
      activeFilters.statuses.length +
      activeFilters.categories.length +
      activeFilters.assignedUsers.length +
      activeFilters.createdBy.length +
      (activeFilters.amountRange.min || activeFilters.amountRange.max ? 1 : 0)
    );
  };

  const clearAllFilters = () => {
    onFiltersChange({
      departments: [],
      riskLevels: [],
      statuses: [],
      categories: [],
      assignedUsers: [],
      createdBy: [],
      amountRange: {},
      logicOperator: 'AND'
    });
  };

  const savePreset = () => {
    if (presetName.trim()) {
      onPresetSave({
        name: presetName.trim(),
        filters: activeFilters
      });
      setPresetName('');
      setShowPresetInput(false);
    }
  };

  return (
    <Card className="w-full">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                <CardTitle className="text-lg">Advanced Filters</CardTitle>
                {getActiveFilterCount() > 0 && (
                  <Badge variant="default">
                    {getActiveFilterCount()} active
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {resultCount !== undefined && (
                  <span className="text-sm text-muted-foreground">
                    {isLoading ? 'Loading...' : `${resultCount} results`}
                  </span>
                )}
                <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Logic Operator */}
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium">Filter Logic:</Label>
              <Select 
                value={activeFilters.logicOperator} 
                onValueChange={(value: 'AND' | 'OR') => updateFilters({ logicOperator: value })}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AND">AND (All)</SelectItem>
                  <SelectItem value="OR">OR (Any)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Department Filter */}
              <MultiSelectFilter
                label="Departments"
                options={filterConfig.departments}
                selectedValues={activeFilters.departments}
                onChange={(values) => updateFilters({ departments: values })}
              />

              {/* Risk Level Filter */}
              <MultiSelectFilter
                label="Risk Levels"
                options={filterConfig.riskLevels}
                selectedValues={activeFilters.riskLevels}
                onChange={(values) => updateFilters({ riskLevels: values })}
              />

              {/* Status Filter */}
              <MultiSelectFilter
                label="Status"
                options={filterConfig.statuses}
                selectedValues={activeFilters.statuses}
                onChange={(values) => updateFilters({ statuses: values })}
              />

              {/* Category Filter */}
              <MultiSelectFilter
                label="Categories"
                options={filterConfig.categories}
                selectedValues={activeFilters.categories}
                onChange={(values) => updateFilters({ categories: values })}
              />

              {/* Assigned Users Filter */}
              <MultiSelectFilter
                label="Assigned Users"
                options={filterConfig.users}
                selectedValues={activeFilters.assignedUsers}
                onChange={(values) => updateFilters({ assignedUsers: values })}
              />

              {/* Created By Filter */}
              <MultiSelectFilter
                label="Created By"
                options={filterConfig.users}
                selectedValues={activeFilters.createdBy}
                onChange={(values) => updateFilters({ createdBy: values })}
              />
            </div>

            {/* Amount Range Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Amount Range</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min amount"
                  value={activeFilters.amountRange.min || ''}
                  onChange={(e) => updateFilters({
                    amountRange: {
                      ...activeFilters.amountRange,
                      min: e.target.value ? Number(e.target.value) : undefined
                    }
                  })}
                  className="w-32"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="number"
                  placeholder="Max amount"
                  value={activeFilters.amountRange.max || ''}
                  onChange={(e) => updateFilters({
                    amountRange: {
                      ...activeFilters.amountRange,
                      max: e.target.value ? Number(e.target.value) : undefined
                    }
                  })}
                  className="w-32"
                />
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  disabled={getActiveFilterCount() === 0}
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </div>

              {/* Preset Management */}
              <div className="flex items-center gap-2">
                {showPresetInput ? (
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Preset name"
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      className="w-32"
                      onKeyPress={(e) => e.key === 'Enter' && savePreset()}
                    />
                    <Button size="sm" onClick={savePreset} disabled={!presetName.trim()}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setShowPresetInput(false);
                        setPresetName('');
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPresetInput(true)}
                    disabled={getActiveFilterCount() === 0}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save Preset
                  </Button>
                )}

                {presets.length > 0 && (
                  <Select onValueChange={(value) => {
                    const preset = presets.find(p => p.id === value);
                    if (preset) onPresetLoad(preset);
                  }}>
                    <SelectTrigger className="w-[140px]">
                      <FolderOpen className="h-4 w-4 mr-1" />
                      <SelectValue placeholder="Load Preset" />
                    </SelectTrigger>
                    <SelectContent>
                      {presets.map((preset) => (
                        <SelectItem key={preset.id} value={preset.id}>
                          {preset.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default AdvancedFilters;
