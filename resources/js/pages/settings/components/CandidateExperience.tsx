import { useState } from 'react';
import { usePage, router, Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import ConfirmModal from '@/components/confirm-modal';
import {
    Plus,
    Trash2,
    Edit2,
    Briefcase,
    FileText,
    CalendarIcon,
} from 'lucide-react';
import InputError from '@/components/input-error';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

import * as ExperienceController from '@/actions/App/Http/Controllers/Candidate/ExperienceController';

type Document = {
    id: number;
    file_path: string;
    file_name: string;
    file_type: string;
};

type Experience = {
    id: number;
    company_name: string;
    position: string;
    start_date: string | null;
    end_date: string | null;
    is_current: boolean;
    description: string | null;
    document_id: number | null;
    document?: Document | null;
};

type PageProps = {
    candidateProfile: {
        experiences: Experience[];
    };
};

export default function CandidateExperience() {
    const { candidateProfile } = usePage<PageProps>().props;
    const experiences = candidateProfile?.experiences ?? [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExperience, setEditingExperience] =
        useState<Experience | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // UI States for Form
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [isCurrent, setIsCurrent] = useState<boolean>(false);

    const openAddModal = () => {
        setEditingExperience(null);
        setStartDate(null);
        setEndDate(null);
        setIsCurrent(false);
        setIsModalOpen(true);
    };

    const openEditModal = (experience: Experience) => {
        setEditingExperience(experience);
        setStartDate(
            experience.start_date ? new Date(experience.start_date) : null,
        );
        setEndDate(experience.end_date ? new Date(experience.end_date) : null);
        setIsCurrent(experience.is_current);
        setIsModalOpen(true);
    };

    const onSuccess = () => {
        setIsModalOpen(false);
    };

    const handleDelete = (id: number) => {
        router.delete(ExperienceController.destroy.url({ experience: id }), {
            preserveScroll: true,
        });
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
        return dayjs(dateString).format('MMMM YYYY');
    };

    const calculateDuration = (
        startDate: string | null,
        endDate: string | null,
        isCurrent: boolean,
    ) => {
        if (!startDate) return '';

        const start = dayjs(startDate);
        const end = isCurrent || !endDate ? dayjs() : dayjs(endDate);

        const years = end.diff(start, 'year');
        const months = end.diff(start, 'month') % 12;

        let durationStr = '';
        if (years > 0) durationStr += `${years} thn `;
        if (months > 0) durationStr += `${months} bln`;

        return durationStr.trim() ? `(${durationStr.trim()})` : '';
    };

    return (
        <Card>
            {/* ── Header ── */}
            <CardHeader className="pb-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="space-y-1 pr-4">
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-[#0077b6]" />
                            Pengalaman Kerja
                        </CardTitle>
                        <CardDescription>
                            Tambahkan riwayat pengalaman kerja Anda. Ini akan
                            sangat membantu rekruter.
                        </CardDescription>
                    </div>
                    <Button
                        onClick={openAddModal}
                        className="shrink-0 rounded-md bg-[#0077b6] text-white shadow-sm transition-all hover:bg-[#005f92]"
                        size="sm"
                    >
                        <Plus className="mr-1.5 h-4 w-4" />
                        Tambah Pengalaman
                    </Button>
                </div>
            </CardHeader>

            {/* ── Experience List ── */}
            <CardContent>
                <div className="relative space-y-4 before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-slate-200">
                    {experiences.length === 0 ? (
                        <p className="pl-8 text-sm text-slate-400">
                            Belum ada riwayat pengalaman kerja yang ditambahkan.
                        </p>
                    ) : (
                        experiences.map((exp) => (
                            <div
                                key={exp.id}
                                className="group relative flex items-start pl-8 transition-all"
                            >
                                {/* Pipeline Dot */}
                                <div className="absolute top-1/2 left-[11px] h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-[#0077b6] ring-2 ring-blue-100" />

                                <div className="flex w-full flex-col justify-between gap-4 py-3 transition-all sm:flex-row sm:items-start">
                                    <div className="flex w-full flex-col">
                                        <div className="flex w-full items-start justify-between">
                                            <div>
                                                <h4 className="text-base font-bold text-slate-800">
                                                    {exp.position}
                                                </h4>
                                                <div className="mt-0.5 text-sm font-medium text-blue-700">
                                                    {exp.company_name}
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                                    onClick={() =>
                                                        openEditModal(exp)
                                                    }
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                                    onClick={() =>
                                                        setDeleteId(exp.id)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 font-semibold text-blue-700">
                                                {formatDate(exp.start_date)} -{' '}
                                                {exp.is_current
                                                    ? 'Sekarang'
                                                    : formatDate(exp.end_date)}
                                            </span>
                                            <span className="text-slate-400">
                                                {calculateDuration(
                                                    exp.start_date,
                                                    exp.end_date,
                                                    exp.is_current,
                                                )}
                                            </span>
                                        </div>

                                        {exp.description && (
                                            <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-slate-600">
                                                {exp.description}
                                            </p>
                                        )}

                                        {exp.document && (
                                            <div className="mt-4">
                                                <a
                                                    href={`/documents/${exp.document.id}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-blue-600 transition-colors hover:border-blue-200 hover:bg-blue-50"
                                                >
                                                    <FileText className="h-4 w-4 text-blue-500" />
                                                    {exp.document.file_name ||
                                                        'Lihat Dokumen Paklaring'}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>

            {/* ── Modal Add / Edit ── */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="overflow-hidden border-none p-0 shadow-2xl sm:max-w-2xl">
                    <Form
                        {...(editingExperience
                            ? ExperienceController.update.form({
                                  experience: editingExperience.id,
                              })
                            : ExperienceController.store.form())}
                        options={{
                            preserveScroll: true,
                        }}
                        onSuccess={onSuccess}
                        encType="multipart/form-data"
                    >
                        {({ processing, errors }) => (
                            <>
                                {/* Modal Header */}
                                <div className="border-b border-slate-100 bg-slate-50 px-6 py-6">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-4 text-xl font-bold text-slate-800">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shadow-sm">
                                                <Briefcase className="h-6 w-6" />
                                            </div>
                                            <div className="flex flex-col gap-1 text-left">
                                                <span>
                                                    {editingExperience
                                                        ? 'Edit Pengalaman Kerja'
                                                        : 'Tambah Pengalaman Baru'}
                                                </span>
                                                <DialogDescription className="text-sm font-normal text-slate-500">
                                                    Ceritakan pengalaman kerja
                                                    Anda secara detail.
                                                </DialogDescription>
                                            </div>
                                        </DialogTitle>
                                    </DialogHeader>
                                </div>

                                {/* Modal Body */}
                                <div className="max-h-[70vh] space-y-8 overflow-y-auto px-6 py-6">
                                    {/* Seksi Perusahaan & Posisi */}
                                    <div className="space-y-4">
                                        <h4 className="flex items-center gap-2 border-b border-slate-100 pb-2 text-sm font-semibold text-slate-900">
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-500">
                                                1
                                            </span>
                                            Detail Pekerjaan
                                        </h4>
                                        <div className="grid gap-5">
                                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                                {/* Company Name */}
                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor="company_name"
                                                        className="text-slate-600"
                                                    >
                                                        Nama Perusahaan{' '}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <Input
                                                        id="company_name"
                                                        name="company_name"
                                                        defaultValue={
                                                            editingExperience?.company_name ||
                                                            ''
                                                        }
                                                        placeholder="Contoh: PT. Teknologi Nusantara"
                                                        className="h-11 border-slate-200 focus-visible:ring-blue-500"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.company_name
                                                        }
                                                    />
                                                </div>

                                                {/* Position */}
                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor="position"
                                                        className="text-slate-600"
                                                    >
                                                        Posisi / Jabatan{' '}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <Input
                                                        id="position"
                                                        name="position"
                                                        defaultValue={
                                                            editingExperience?.position ||
                                                            ''
                                                        }
                                                        placeholder="Contoh: Frontend Developer"
                                                        className="h-11 border-slate-200 focus-visible:ring-blue-500"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.position
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Seksi Durasi */}
                                    <div className="space-y-4">
                                        <h4 className="flex items-center gap-2 border-b border-slate-100 pb-2 text-sm font-semibold text-slate-900">
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-500">
                                                2
                                            </span>
                                            Masa Kerja
                                        </h4>
                                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                            {/* Start Date */}
                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="start_date"
                                                    className="text-slate-600"
                                                >
                                                    Tanggal Mulai
                                                </Label>
                                                <input
                                                    type="hidden"
                                                    name="start_date"
                                                    value={
                                                        startDate
                                                            ? dayjs(
                                                                  startDate,
                                                              ).format(
                                                                  'YYYY-MM-DD',
                                                              )
                                                            : ''
                                                    }
                                                />
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant={'outline'}
                                                            className={cn(
                                                                'h-11 w-full justify-start border-slate-200 text-left font-normal focus:border-blue-500 focus:ring-blue-500',
                                                                !startDate &&
                                                                    'text-muted-foreground',
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                                            {startDate ? (
                                                                format(
                                                                    startDate,
                                                                    'PPP',
                                                                    {
                                                                        locale: id,
                                                                    },
                                                                )
                                                            ) : (
                                                                <span>
                                                                    Pilih
                                                                    tanggal
                                                                </span>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-auto p-0"
                                                        align="start"
                                                    >
                                                        <Calendar
                                                            selected={
                                                                startDate ||
                                                                undefined
                                                            }
                                                            onSelect={
                                                                setStartDate
                                                            }
                                                            disabled={(date) =>
                                                                date >
                                                                new Date()
                                                            }
                                                            yearRange={{
                                                                from: 1990,
                                                                to: new Date().getFullYear(),
                                                            }}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <InputError
                                                    message={errors.start_date}
                                                />
                                            </div>

                                            {/* End Date */}
                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="end_date"
                                                    className="text-slate-600"
                                                >
                                                    Tanggal Selesai
                                                </Label>
                                                <input
                                                    type="hidden"
                                                    name="end_date"
                                                    value={
                                                        endDate && !isCurrent
                                                            ? dayjs(
                                                                  endDate,
                                                              ).format(
                                                                  'YYYY-MM-DD',
                                                              )
                                                            : ''
                                                    }
                                                />
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant={'outline'}
                                                            disabled={isCurrent}
                                                            className={cn(
                                                                'h-11 w-full justify-start border-slate-200 text-left font-normal focus:border-blue-500 focus:ring-blue-500',
                                                                !endDate &&
                                                                    'text-muted-foreground',
                                                                isCurrent &&
                                                                    'bg-slate-50 text-slate-400 opacity-100',
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                                            {endDate &&
                                                            !isCurrent ? (
                                                                format(
                                                                    endDate,
                                                                    'PPP',
                                                                    {
                                                                        locale: id,
                                                                    },
                                                                )
                                                            ) : (
                                                                <span>
                                                                    Pilih
                                                                    tanggal
                                                                </span>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-auto p-0"
                                                        align="start"
                                                    >
                                                        <Calendar
                                                            selected={
                                                                endDate ||
                                                                undefined
                                                            }
                                                            onSelect={
                                                                setEndDate
                                                            }
                                                            disabled={(date) =>
                                                                date >
                                                                    new Date() ||
                                                                (startDate
                                                                    ? date <
                                                                      startDate
                                                                    : false)
                                                            }
                                                            yearRange={{
                                                                from: 1990,
                                                                to: new Date().getFullYear(),
                                                            }}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <InputError
                                                    message={errors.end_date}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-2 flex items-center space-x-2">
                                            <Checkbox
                                                id="is_current"
                                                name="is_current"
                                                value="1"
                                                checked={isCurrent}
                                                onCheckedChange={(checked) => {
                                                    setIsCurrent(
                                                        checked === true,
                                                    );
                                                    if (checked) {
                                                        setEndDate(null);
                                                    }
                                                }}
                                            />
                                            <Label
                                                htmlFor="is_current"
                                                className="text-sm leading-none font-medium text-slate-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Saya masih bekerja di sini
                                            </Label>
                                        </div>
                                    </div>

                                    {/* Seksi Deskripsi & Dokumen */}
                                    <div className="space-y-4">
                                        <h4 className="flex items-center gap-2 border-b border-slate-100 pb-2 text-sm font-semibold text-slate-900">
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-500">
                                                3
                                            </span>
                                            Deskripsi & Bukti
                                        </h4>
                                        <div className="grid gap-5">
                                            {/* Description */}
                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="description"
                                                    className="text-slate-600"
                                                >
                                                    Deskripsi Pekerjaan
                                                </Label>
                                                <Textarea
                                                    id="description"
                                                    name="description"
                                                    defaultValue={
                                                        editingExperience?.description ||
                                                        ''
                                                    }
                                                    placeholder="Ceritakan tanggung jawab dan pencapaian Anda selama bekerja di posisi ini..."
                                                    className="min-h-[120px] resize-y border-slate-200 focus-visible:ring-blue-500"
                                                />
                                                <InputError
                                                    message={errors.description}
                                                />
                                            </div>

                                            {/* File Paklaring */}
                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="file"
                                                    className="text-slate-600"
                                                >
                                                    Surat Keterangan Kerja /
                                                    Paklaring (Opsional)
                                                </Label>
                                                <div className="flex items-center gap-3">
                                                    <Input
                                                        id="file"
                                                        name="file"
                                                        type="file"
                                                        className="cursor-pointer border-slate-200 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-xs file:font-medium file:text-blue-700 hover:file:bg-blue-100 focus-visible:ring-blue-500"
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                    />
                                                </div>
                                                <p className="mt-1 text-[11px] text-slate-500">
                                                    Format: PDF, JPG, PNG.
                                                    Maksimal 2MB.
                                                </p>
                                                <InputError
                                                    message={errors.file}
                                                />
                                                {editingExperience?.document && (
                                                    <p className="mt-1 text-xs text-blue-600">
                                                        Dokumen saat ini:{' '}
                                                        <a
                                                            href={`/documents/${editingExperience.document.id}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="font-medium underline hover:text-blue-800"
                                                        >
                                                            {editingExperience
                                                                .document
                                                                .file_name ||
                                                                'Lihat Dokumen'}
                                                        </a>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="flex justify-end gap-3 rounded-b-lg border-t border-slate-100 bg-slate-50 px-6 py-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsModalOpen(false)}
                                        className="h-10 px-5 text-slate-600 hover:text-slate-800"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="h-10 bg-blue-600 px-6 text-white shadow-sm hover:bg-blue-700"
                                    >
                                        {processing
                                            ? 'Menyimpan...'
                                            : 'Simpan Pengalaman'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>

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
                title="Hapus Pengalaman Kerja?"
                description="Apakah Anda yakin ingin menghapus riwayat pengalaman kerja ini dari profil Anda? Semua dokumen terkait paklaring juga akan terhapus. Tindakan ini tidak dapat dibatalkan."
            />
        </Card>
    );
}
