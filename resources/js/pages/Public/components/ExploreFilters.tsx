import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Department } from '@/types/department';
import { Skill } from '@/types/skill';

interface ExploreFiltersProps {
    departments: Department[];
    skills: Skill[];
    jobTypeOptions: { id: string; name: string }[];
    locationOptions: { id: string; name: string }[];
    filterDept: string;
    setFilterDept: (val: string) => void;
    filterSkill: string[];
    setFilterSkill: React.Dispatch<React.SetStateAction<string[]>>;
    filterType: string;
    setFilterType: (val: string) => void;
    filterLocation: string;
    setFilterLocation: (val: string) => void;
    onReset: () => void;
}

export function ExploreFilters({
    departments,
    skills,
    jobTypeOptions,
    locationOptions,
    filterDept,
    setFilterDept,
    filterSkill,
    setFilterSkill,
    filterType,
    setFilterType,
    filterLocation,
    setFilterLocation,
    onReset,
}: ExploreFiltersProps) {
    return (
        <div className="mb-12 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                    Filter Pekerjaan
                </h3>
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-700"
                >
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                    Reset Filter
                </button>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col space-y-2">
                    <label
                        htmlFor="filter-dept"
                        className="text-sm font-medium text-gray-700"
                    >
                        Departemen
                    </label>
                    <Select value={filterDept} onValueChange={setFilterDept}>
                        <SelectTrigger
                            id="filter-dept"
                            className="h-14 w-full bg-white text-base"
                        >
                            <SelectValue placeholder="Pilih Departemen" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Semua Departemen
                            </SelectItem>
                            {departments.map((dept) => (
                                <SelectItem
                                    key={dept.id}
                                    value={dept.id.toString()}
                                >
                                    {dept.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col space-y-2">
                    <label
                        htmlFor="filter-skill"
                        className="text-sm font-medium text-gray-700"
                    >
                        Keahlian
                    </label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                id="filter-skill"
                                className="w-full justify-between border-input bg-white px-3 py-2 text-base font-normal shadow-sm hover:bg-accent hover:text-accent-foreground"
                            >
                                <span className="truncate">
                                    {filterSkill.length === 0
                                        ? 'Semua Keahlian'
                                        : filterSkill.length === 1
                                          ? skills.find(
                                                (s) =>
                                                    s.id.toString() ===
                                                    filterSkill[0],
                                            )?.name
                                          : `${filterSkill.length} Keahlian Dipilih`}
                                </span>
                                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                            <div className="max-h-[300px] overflow-y-auto">
                                {skills.map((skill) => (
                                    <DropdownMenuCheckboxItem
                                        key={skill.id}
                                        checked={filterSkill.includes(
                                            skill.id.toString(),
                                        )}
                                        onCheckedChange={(checked) => {
                                            setFilterSkill((prev) =>
                                                checked
                                                    ? [
                                                          ...prev,
                                                          skill.id.toString(),
                                                      ]
                                                    : prev.filter(
                                                          (id) =>
                                                              id !==
                                                              skill.id.toString(),
                                                      ),
                                            );
                                        }}
                                    >
                                        {skill.name}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </div>
                            {filterSkill.length > 0 && (
                                <>
                                    <DropdownMenuSeparator />
                                    <button
                                        onClick={() => setFilterSkill([])}
                                        className="w-full cursor-pointer rounded-sm px-2 py-1.5 text-center text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                                    >
                                        Hapus Semua Pilihan
                                    </button>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex flex-col space-y-2">
                    <label
                        htmlFor="filter-location"
                        className="text-sm font-medium text-gray-700"
                    >
                        Lokasi
                    </label>
                    <Select
                        value={filterLocation}
                        onValueChange={setFilterLocation}
                    >
                        <SelectTrigger
                            id="filter-location"
                            className="h-14 w-full bg-white text-base"
                        >
                            <SelectValue placeholder="Pilih Lokasi" />
                        </SelectTrigger>
                        <SelectContent>
                            {locationOptions.map((loc) => (
                                <SelectItem key={loc.id} value={loc.id}>
                                    {loc.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col space-y-2">
                    <label
                        htmlFor="filter-type"
                        className="text-sm font-medium text-gray-700"
                    >
                        Tipe Pekerjaan
                    </label>
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger
                            id="filter-type"
                            className="h-14 w-full bg-white text-base"
                        >
                            <SelectValue placeholder="Pilih Tipe" />
                        </SelectTrigger>
                        <SelectContent>
                            {jobTypeOptions.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                    {type.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
