import { useState, useEffect } from 'react';
import { Deferred, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion'; // <-- Tambahkan import ini
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import ConfirmModal from '@/components/confirm-modal';
import { X, Plus, Trash2, Check, ChevronsUpDown, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { store as storeCandidateSkill } from '@/routes/candidate/skills';
import { destroy as destroyCandidateSkill } from '@/routes/candidate/skills';
import { index as skillsIndex } from '@/routes/public/skills';

type Skill = {
    id: number;
    name: string;
};

type CandidateSkill = {
    id: number;
    name: string;
    slug?: string;
    pivot: {
        candidate_id: number;
        skill_id: number;
        level: 'beginner' | 'intermediate' | 'expert' | 'master';
    };
};

type PageProps = {
    skills: Skill[];
    candidateProfile: {
        skills: CandidateSkill[];
    };
};

type SkillRow = {
    uid: number;
    skillId: string;
    level: string;
};

const LEVEL_LABEL: Record<string, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    expert: 'Expert',
    master: 'Master',
};

const LEVEL_STYLE: Record<string, string> = {
    beginner: 'bg-slate-100 text-slate-600',
    intermediate: 'bg-blue-50 text-blue-600',
    expert: 'bg-violet-50 text-violet-600',
    master: 'bg-amber-50 text-amber-600',
};

const MAX_SKILLS = 10;
let uidCounter = 0;
const newRow = (): SkillRow => ({ uid: uidCounter++, skillId: '', level: '' });

export default function CandidateSkill() {
    const { skills, candidateProfile } = usePage<PageProps>().props;
    const initialCandidateSkills = candidateProfile?.skills ?? [];

    const [expanded, setExpanded] = useState(false);
    const [rows, setRows] = useState<SkillRow[]>([newRow()]);
    const [processing, setProcessing] = useState(false);

    // State untuk mengontrol Popover Combobox per baris
    const [openCombobox, setOpenCombobox] = useState<number | null>(null);

    // --- STATE UNTUK ASYNC SEARCH ---
    const [searchQuery, setSearchQuery] = useState('');
    const [asyncSkills, setAsyncSkills] = useState<Skill[]>(skills ?? []);
    const [isSearching, setIsSearching] = useState(false);

    // State untuk AlertDialog Delete
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Efek debounce untuk hit API pencarian
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (expanded) {
                setIsSearching(true);
                axios
                    .get(skillsIndex.url({ query: { search: searchQuery } }))
                    .then((res) => {
                        setAsyncSkills(res.data.skills);
                    })
                    .catch((err) => console.error(err))
                    .finally(() => setIsSearching(false));
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, expanded]);
    // --------------------------------

    // --- LOGIKA LIMIT & DUPLIKAT ---
    const savedSkillIds = initialCandidateSkills.map((cs) =>
        cs.pivot.skill_id.toString(),
    );
    const totalCurrentSkills = initialCandidateSkills.length;
    const remainingSlots = MAX_SKILLS - totalCurrentSkills;
    const canAddMoreRow = rows.length < remainingSlots;

    const getAvailableSkills = (currentUid: number) => {
        const selectedInOtherRows = rows
            .filter((r) => r.uid !== currentUid && r.skillId)
            .map((r) => r.skillId);

        return (
            asyncSkills?.filter(
                (skill) =>
                    !savedSkillIds.includes(skill.id.toString()) &&
                    !selectedInOtherRows.includes(skill.id.toString()),
            ) ?? []
        );
    };
    // -------------------------------

    const addRow = () => {
        if (canAddMoreRow) {
            setRows((prev) => [...prev, newRow()]);
        }
    };

    const removeRow = (uid: number) => {
        setRows((prev) => {
            const next = prev.filter((r) => r.uid !== uid);
            return next.length === 0 ? [newRow()] : next;
        });
    };

    const updateRow = (uid: number, field: keyof SkillRow, value: string) => {
        setRows((prev) =>
            prev.map((r) => (r.uid === uid ? { ...r, [field]: value } : r)),
        );
    };

    const handleOpen = () => {
        setRows([newRow()]);
        setExpanded(true);
    };

    const handleCancel = () => {
        setExpanded(false);
        setRows([newRow()]);
        setOpenCombobox(null);
        setSearchQuery('');
    };

    const handleSave = () => {
        const valid = rows.filter((r) => r.skillId && r.level);
        if (valid.length === 0) return;

        setProcessing(true);
        router.post(
            storeCandidateSkill.url(),
            {
                skills: valid.map((r) => ({
                    skill_id: parseInt(r.skillId, 10),
                    level: r.level,
                })),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setExpanded(false);
                    setRows([newRow()]);
                    setSearchQuery('');
                },
                onFinish: () => setProcessing(false),
            },
        );
    };

    const handleDelete = (id: number) => {
        router.delete(destroyCandidateSkill.url({ skill: id }), {
            preserveScroll: true,
        });
    };

    const allKnownSkills = [...(skills || []), ...(asyncSkills || [])];

    return (
        <Card>
            {/* ── Header ── */}
            <CardHeader className="pb-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="space-y-1 pr-4">
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-[#0077b6]" />
                            Skills
                        </CardTitle>
                        <CardDescription>
                            Daftar skill yang Anda kuasai (Maksimal {MAX_SKILLS}{' '}
                            skill). Saat ini: {totalCurrentSkills}/{MAX_SKILLS}
                        </CardDescription>
                    </div>
                    {!expanded && totalCurrentSkills < MAX_SKILLS && (
                        <Button
                            onClick={handleOpen}
                            className="shrink-0 rounded-md bg-[#0077b6] text-white shadow-sm transition-all hover:bg-[#005f92]"
                            size="sm"
                        >
                            <Plus className="mr-1.5 h-4 w-4" />
                            Add Skill
                        </Button>
                    )}
                </div>
            </CardHeader>

            {/* ── Inline Expandable Form dengan Framer Motion ── */}
            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <Deferred
                            data="skills"
                            fallback={
                                <div className="flex flex-col items-center justify-center gap-3 border-t px-5 py-8">
                                    <svg
                                        className="h-5 w-5 animate-spin text-slate-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    <span className="text-sm text-slate-500">
                                        Memuat daftar skill...
                                    </span>
                                </div>
                            }
                        >
                            <div className="border-t px-5 py-4">
                                <div className="mb-2 grid grid-cols-[1fr_1fr_auto] gap-2">
                                    <Label className="text-xs text-slate-500">
                                        Nama Skill
                                    </Label>
                                    <Label className="text-xs text-slate-500">
                                        Level
                                    </Label>
                                    <span />
                                </div>

                                <div className="flex flex-col gap-2">
                                    {rows.map((row) => {
                                        const availableSkills =
                                            getAvailableSkills(row.uid);
                                        const selectedSkillName =
                                            allKnownSkills.find(
                                                (s) =>
                                                    s.id.toString() ===
                                                    row.skillId,
                                            )?.name;

                                        return (
                                            <div
                                                key={row.uid}
                                                className="grid grid-cols-[1fr_1fr_auto] items-center gap-2"
                                            >
                                                {/* Skill Searchable Select (Combobox) */}
                                                <Popover
                                                    open={
                                                        openCombobox === row.uid
                                                    }
                                                    onOpenChange={(isOpen) => {
                                                        setOpenCombobox(
                                                            isOpen
                                                                ? row.uid
                                                                : null,
                                                        );
                                                        if (!isOpen)
                                                            setSearchQuery(''); // Reset search pas ditutup
                                                    }}
                                                >
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            aria-expanded={
                                                                openCombobox ===
                                                                row.uid
                                                            }
                                                            className={cn(
                                                                'w-full justify-between font-normal',
                                                                !row.skillId &&
                                                                    'text-muted-foreground',
                                                            )}
                                                        >
                                                            {row.skillId
                                                                ? selectedSkillName
                                                                : '-- Cari Skill --'}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-[300px] p-0"
                                                        align="start"
                                                    >
                                                        <Command
                                                            shouldFilter={false}
                                                        >
                                                            <CommandInput
                                                                placeholder="Ketik nama skill..."
                                                                value={
                                                                    searchQuery
                                                                }
                                                                onValueChange={
                                                                    setSearchQuery
                                                                }
                                                            />
                                                            <CommandList>
                                                                {isSearching ? (
                                                                    <div className="py-6 text-center text-sm text-slate-500">
                                                                        Mencari...
                                                                    </div>
                                                                ) : (
                                                                    <CommandEmpty>
                                                                        Skill
                                                                        tidak
                                                                        ditemukan.
                                                                    </CommandEmpty>
                                                                )}
                                                                <CommandGroup>
                                                                    {!isSearching &&
                                                                        availableSkills.map(
                                                                            (
                                                                                skill,
                                                                            ) => (
                                                                                <CommandItem
                                                                                    key={
                                                                                        skill.id
                                                                                    }
                                                                                    value={
                                                                                        skill.name
                                                                                    }
                                                                                    onSelect={() => {
                                                                                        updateRow(
                                                                                            row.uid,
                                                                                            'skillId',
                                                                                            skill.id.toString(),
                                                                                        );
                                                                                        setOpenCombobox(
                                                                                            null,
                                                                                        );
                                                                                        setSearchQuery(
                                                                                            '',
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <Check
                                                                                        className={cn(
                                                                                            'mr-2 h-4 w-4',
                                                                                            row.skillId ===
                                                                                                skill.id.toString()
                                                                                                ? 'opacity-100'
                                                                                                : 'opacity-0',
                                                                                        )}
                                                                                    />
                                                                                    {
                                                                                        skill.name
                                                                                    }
                                                                                </CommandItem>
                                                                            ),
                                                                        )}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>

                                                {/* Level Select */}
                                                <Select
                                                    value={row.level}
                                                    onValueChange={(v) =>
                                                        updateRow(
                                                            row.uid,
                                                            'level',
                                                            v,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="-- Pilih Level --" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {Object.entries(
                                                                LEVEL_LABEL,
                                                            ).map(
                                                                ([
                                                                    val,
                                                                    label,
                                                                ]) => (
                                                                    <SelectItem
                                                                        key={
                                                                            val
                                                                        }
                                                                        value={
                                                                            val
                                                                        }
                                                                    >
                                                                        {label}
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>

                                                {/* Remove row button */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeRow(row.uid)
                                                    }
                                                    className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                                                    aria-label="Hapus baris"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Add another row */}
                                {canAddMoreRow && (
                                    <button
                                        type="button"
                                        onClick={addRow}
                                        className="mt-2 flex w-full items-center gap-2 rounded-md border border-dashed border-slate-200 px-3 py-2 text-sm text-slate-400 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Tambah skill lagi (
                                        {remainingSlots - rows.length} tersisa)
                                    </button>
                                )}

                                {/* Footer actions */}
                                <div className="mt-4 flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCancel}
                                        disabled={processing}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={handleSave}
                                        disabled={processing}
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan'}
                                    </Button>
                                </div>
                            </div>
                        </Deferred>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Badge list ── */}
            <CardContent>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    {initialCandidateSkills?.length === 0 && (
                        <p className="text-sm text-slate-400">
                            Belum ada skill yang ditambahkan.
                        </p>
                    )}
                    {initialCandidateSkills?.map((cs) => (
                        <span
                            key={cs.id}
                            className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 py-1 pr-1.5 pl-2.5 text-xs font-semibold text-slate-700"
                        >
                            {cs.name}
                            <span
                                className={cn(
                                    'rounded px-1.5 py-0.5 text-[10px] font-medium',
                                    LEVEL_STYLE[cs.pivot.level] ??
                                        'bg-slate-200 text-slate-500',
                                )}
                            >
                                {LEVEL_LABEL[cs.pivot.level] ?? cs.pivot.level}
                            </span>
                            <button
                                type="button"
                                onClick={() => setDeleteId(cs.pivot.skill_id)}
                                className="ml-0.5 flex items-center rounded p-0.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                                aria-label={`Hapus ${cs.name}`}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
            </CardContent>

            {/* ── Modal Delete ── */}
            <ConfirmModal
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={() => {
                    if (deleteId !== null) {
                        handleDelete(deleteId);
                        setDeleteId(null);
                    }
                }}
                title="Hapus Skill?"
                description="Apakah Anda yakin ingin menghapus skill ini dari profil Anda? Tindakan ini tidak dapat dibatalkan."
            />
        </Card>
    );
}
