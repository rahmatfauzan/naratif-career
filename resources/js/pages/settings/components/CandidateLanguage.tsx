import { useState, useEffect } from 'react';
import { Deferred, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
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
import { X, Plus, Trash2, Check, ChevronsUpDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { store as storeCandidateLanguage } from '@/routes/candidate/languages';
import { destroy as destroyCandidateLanguage } from '@/routes/candidate/languages';
import { index as languagesIndex } from '@/routes/public/languages';

type Language = {
    id: number;
    name: string;
};

type CandidateLanguage = {
    id: number;
    name: string;
    pivot: {
        candidate_id: number;
        language_id: number;
        proficiency: 'Beginner' | 'Conversational' | 'Fluent' | 'Native';
    };
};

type PageProps = {
    languages: Language[];
    candidateProfile: {
        languages: CandidateLanguage[];
    };
};

type LanguageRow = {
    uid: number;
    languageId: string;
    proficiency: string;
};

const PROFICIENCY_LABEL: Record<string, string> = {
    Beginner: 'Beginner',
    Conversational: 'Conversational',
    Fluent: 'Fluent',
    Native: 'Native',
};

const PROFICIENCY_STYLE: Record<string, string> = {
    Beginner: 'bg-slate-100 text-slate-600',
    Conversational: 'bg-blue-50 text-blue-600',
    Fluent: 'bg-violet-50 text-violet-600',
    Native: 'bg-amber-50 text-amber-600',
};

const MAX_LANGUAGES = 5;
let uidCounter = 0;
const newRow = (): LanguageRow => ({
    uid: uidCounter++,
    languageId: '',
    proficiency: '',
});

export default function CandidateLanguage() {
    const { languages, candidateProfile } = usePage<PageProps>().props;
    const initialCandidateLanguages = candidateProfile?.languages ?? [];

    const [expanded, setExpanded] = useState(false);
    const [rows, setRows] = useState<LanguageRow[]>([newRow()]);
    const [processing, setProcessing] = useState(false);

    // State untuk mengontrol Popover Combobox per baris
    const [openCombobox, setOpenCombobox] = useState<number | null>(null);

    // --- STATE UNTUK ASYNC SEARCH ---
    const [searchQuery, setSearchQuery] = useState('');
    const [asyncLanguages, setAsyncLanguages] = useState<Language[]>(
        languages ?? [],
    );
    const [isSearching, setIsSearching] = useState(false);

    // State untuk AlertDialog Delete
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Efek debounce untuk hit API pencarian
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (expanded) {
                setIsSearching(true);
                axios
                    .get(languagesIndex.url({ query: { search: searchQuery } }))
                    .then((res) => {
                        setAsyncLanguages(res.data.languages);
                    })
                    .catch((err) => console.error(err))
                    .finally(() => setIsSearching(false));
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, expanded]);
    // --------------------------------

    // --- LOGIKA LIMIT & DUPLIKAT ---
    const savedLanguageIds = initialCandidateLanguages.map((cl) =>
        cl.pivot.language_id.toString(),
    );
    const totalCurrentLanguages = initialCandidateLanguages.length;
    const remainingSlots = MAX_LANGUAGES - totalCurrentLanguages;
    const canAddMoreRow = rows.length < remainingSlots;

    const getAvailableLanguages = (currentUid: number) => {
        const selectedInOtherRows = rows
            .filter((r) => r.uid !== currentUid && r.languageId)
            .map((r) => r.languageId);

        return (
            asyncLanguages?.filter(
                (language) =>
                    !savedLanguageIds.includes(language.id.toString()) &&
                    !selectedInOtherRows.includes(language.id.toString()),
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

    const updateRow = (
        uid: number,
        field: keyof LanguageRow,
        value: string,
    ) => {
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
        const valid = rows.filter((r) => r.languageId && r.proficiency);
        if (valid.length === 0) return;

        setProcessing(true);
        router.post(
            storeCandidateLanguage.url(),
            {
                languages: valid.map((r) => ({
                    language_id: parseInt(r.languageId, 10),
                    proficiency: r.proficiency,
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
        router.delete(destroyCandidateLanguage.url({ language: id }), {
            preserveScroll: true,
        });
    };

    const allKnownLanguages = [...(languages || []), ...(asyncLanguages || [])];

    return (
        <Card>
            {/* ── Header ── */}
            <CardHeader className="pb-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="space-y-1 pr-4">
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-[#0077b6]" />
                            Languages
                        </CardTitle>
                        <CardDescription>
                            Daftar bahasa yang Anda kuasai (Maksimal{' '}
                            {MAX_LANGUAGES} bahasa). Saat ini:{' '}
                            {totalCurrentLanguages}/{MAX_LANGUAGES}
                        </CardDescription>
                    </div>
                    {!expanded && totalCurrentLanguages < MAX_LANGUAGES && (
                        <Button
                            onClick={handleOpen}
                            className="shrink-0 rounded-md bg-[#0077b6] text-white shadow-sm transition-all hover:bg-[#005f92]"
                            size="sm"
                        >
                            <Plus className="mr-1.5 h-4 w-4" />
                            Add Language
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
                            data="languages"
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
                                        Memuat daftar bahasa...
                                    </span>
                                </div>
                            }
                        >
                            <div className="border-t px-5 py-4">
                                <div className="mb-2 grid grid-cols-[1fr_1fr_auto] gap-2">
                                    <Label className="text-xs text-slate-500">
                                        Bahasa
                                    </Label>
                                    <Label className="text-xs text-slate-500">
                                        Tingkat Kemahiran
                                    </Label>
                                    <span />
                                </div>

                                <div className="flex flex-col gap-2">
                                    {rows.map((row) => {
                                        const availableLanguages =
                                            getAvailableLanguages(row.uid);
                                        const selectedLanguageName =
                                            allKnownLanguages.find(
                                                (l) =>
                                                    l.id.toString() ===
                                                    row.languageId,
                                            )?.name;

                                        return (
                                            <div
                                                key={row.uid}
                                                className="grid grid-cols-[1fr_1fr_auto] items-center gap-2"
                                            >
                                                {/* Language Searchable Select (Combobox) */}
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
                                                                !row.languageId &&
                                                                    'text-muted-foreground',
                                                            )}
                                                        >
                                                            {row.languageId
                                                                ? selectedLanguageName
                                                                : '-- Cari Bahasa --'}
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
                                                                placeholder="Ketik bahasa..."
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
                                                                        Bahasa
                                                                        tidak
                                                                        ditemukan.
                                                                    </CommandEmpty>
                                                                )}
                                                                <CommandGroup>
                                                                    {!isSearching &&
                                                                        availableLanguages.map(
                                                                            (
                                                                                language,
                                                                            ) => (
                                                                                <CommandItem
                                                                                    key={
                                                                                        language.id
                                                                                    }
                                                                                    value={
                                                                                        language.name
                                                                                    }
                                                                                    onSelect={() => {
                                                                                        updateRow(
                                                                                            row.uid,
                                                                                            'languageId',
                                                                                            language.id.toString(),
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
                                                                                            row.languageId ===
                                                                                                language.id.toString()
                                                                                                ? 'opacity-100'
                                                                                                : 'opacity-0',
                                                                                        )}
                                                                                    />
                                                                                    {
                                                                                        language.name
                                                                                    }
                                                                                </CommandItem>
                                                                            ),
                                                                        )}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>

                                                {/* Proficiency Select */}
                                                <Select
                                                    value={row.proficiency}
                                                    onValueChange={(v) =>
                                                        updateRow(
                                                            row.uid,
                                                            'proficiency',
                                                            v,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="-- Pilih Kemahiran --" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {Object.entries(
                                                                PROFICIENCY_LABEL,
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
                                        Tambah bahasa lagi (
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
                    {initialCandidateLanguages?.length === 0 && (
                        <p className="text-sm text-slate-400">
                            Belum ada bahasa yang ditambahkan.
                        </p>
                    )}
                    {initialCandidateLanguages?.map((cl) => (
                        <span
                            key={cl.id}
                            className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 py-1 pr-1.5 pl-2.5 text-xs font-semibold text-slate-700"
                        >
                            {cl.name}
                            <span
                                className={cn(
                                    'rounded px-1.5 py-0.5 text-[10px] font-medium',
                                    PROFICIENCY_STYLE[cl.pivot.proficiency] ??
                                        'bg-slate-200 text-slate-500',
                                )}
                            >
                                {PROFICIENCY_LABEL[cl.pivot.proficiency] ??
                                    cl.pivot.proficiency}
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    setDeleteId(cl.pivot.language_id)
                                }
                                className="ml-0.5 flex items-center rounded p-0.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                                aria-label={`Hapus ${cl.name}`}
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
                title="Hapus Bahasa?"
                description="Apakah Anda yakin ingin menghapus kemampuan bahasa ini dari profil Anda? Tindakan ini tidak dapat dibatalkan."
            />
        </Card>
    );
}
