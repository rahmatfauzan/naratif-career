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
import ConfirmModal from '@/components/confirm-modal';
import { Plus, Trash2, Edit2, BookOpen, FileText } from 'lucide-react';
import InputError from '@/components/input-error';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

import * as TrainingController from '@/actions/App/Http/Controllers/Candidate/TrainingController';
import { DatePicker } from '@/components/date-picker';

type Document = {
    id: number;
    file_path: string;
    file_name: string;
    file_type: string;
};

type Training = {
    id: number;
    title: string;
    institution: string | null;
    start_date: string | null;
    end_date: string | null;
    description: string | null;
    document_id: number | null;
    document?: Document | null;
};

type PageProps = {
    candidateProfile: {
        trainings: Training[];
    };
};

export default function CandidateTraining() {
    const { candidateProfile } = usePage<PageProps>().props;
    const trainings = candidateProfile?.trainings ?? [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTraining, setEditingTraining] = useState<Training | null>(
        null,
    );
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // UI States for Form
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const openAddModal = () => {
        setEditingTraining(null);
        setStartDate(null);
        setEndDate(null);
        setIsModalOpen(true);
    };

    const openEditModal = (training: Training) => {
        setEditingTraining(training);
        setStartDate(
            training.start_date ? new Date(training.start_date) : null,
        );
        setEndDate(training.end_date ? new Date(training.end_date) : null);
        setIsModalOpen(true);
    };

    const onSuccess = () => {
        setIsModalOpen(false);
    };

    const handleDelete = (id: number) => {
        router.delete(TrainingController.destroy.url({ training: id }), {
            preserveScroll: true,
        });
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
        return dayjs(dateString).format('MMMM YYYY');
    };

    return (
        <Card>
            {/* ── Header ── */}
            <CardHeader className="pb-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="space-y-1 pr-4">
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-[#0077b6]" />
                            Pelatihan & Kursus
                        </CardTitle>
                        <CardDescription>
                            Tambahkan riwayat pelatihan atau kursus yang pernah
                            Anda ikuti.
                        </CardDescription>
                    </div>
                    <Button
                        onClick={openAddModal}
                        className="shrink-0 rounded-md bg-[#0077b6] text-white shadow-sm transition-all hover:bg-[#005f92]"
                        size="sm"
                    >
                        <Plus className="mr-1.5 h-4 w-4" />
                        Tambah Pelatihan
                    </Button>
                </div>
            </CardHeader>

            {/* ── Training List ── */}
            <CardContent>
                <div className="relative space-y-4 before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-slate-200">
                    {trainings.length === 0 ? (
                        <p className="pl-8 text-sm text-slate-400">
                            Belum ada riwayat pelatihan yang ditambahkan.
                        </p>
                    ) : (
                        trainings.map((training) => (
                            <div
                                key={training.id}
                                className="group relative flex items-start pl-8 transition-all"
                            >
                                {/* Pipeline Dot */}
                                <div className="absolute top-1/2 left-[11px] h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-[#0077b6] ring-2 ring-blue-100" />

                                <div className="flex w-full flex-col justify-between gap-4 py-3 transition-all sm:flex-row sm:items-start">
                                    <div className="flex w-full flex-col">
                                        <div className="flex w-full items-start justify-between">
                                            <div>
                                                <h4 className="text-base font-bold text-slate-800">
                                                    {training.title}
                                                </h4>
                                                {training.institution && (
                                                    <div className="mt-0.5 text-sm font-medium text-blue-700">
                                                        {training.institution}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                                    onClick={() =>
                                                        openEditModal(training)
                                                    }
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                                    onClick={() =>
                                                        setDeleteId(training.id)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {(training.start_date ||
                                            training.end_date) && (
                                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                                <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 font-semibold text-blue-700">
                                                    {formatDate(
                                                        training.start_date,
                                                    )}
                                                    {training.end_date &&
                                                    training.end_date !==
                                                        training.start_date
                                                        ? ` - ${formatDate(training.end_date)}`
                                                        : ''}
                                                </span>
                                            </div>
                                        )}

                                        {training.description && (
                                            <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-slate-600">
                                                {training.description}
                                            </p>
                                        )}

                                        {training.document && (
                                            <div className="mt-4">
                                                <a
                                                    href={`/documents/${training.document.id}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-blue-600 transition-colors hover:border-blue-200 hover:bg-blue-50"
                                                >
                                                    <FileText className="h-4 w-4 text-blue-500" />
                                                    {training.document
                                                        .file_name ||
                                                        'Lihat Dokumen'}
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
                        {...(editingTraining
                            ? TrainingController.update.form({
                                  training: editingTraining.id,
                              })
                            : TrainingController.store.form())}
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
                                                <BookOpen className="h-6 w-6" />
                                            </div>
                                            <div className="flex flex-col gap-1 text-left">
                                                <span>
                                                    {editingTraining
                                                        ? 'Edit Pelatihan'
                                                        : 'Tambah Pelatihan Baru'}
                                                </span>
                                                <DialogDescription className="text-sm font-normal text-slate-500">
                                                    Detail kursus atau pelatihan
                                                    yang Anda ikuti.
                                                </DialogDescription>
                                            </div>
                                        </DialogTitle>
                                    </DialogHeader>
                                </div>

                                {/* Modal Body */}
                                <div className="max-h-[70vh] space-y-8 overflow-y-auto px-6 py-6">
                                    {/* Seksi Detail */}
                                    <div className="space-y-4">
                                        <h4 className="flex items-center gap-2 border-b border-slate-100 pb-2 text-sm font-semibold text-slate-900">
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-500">
                                                1
                                            </span>
                                            Detail Pelatihan
                                        </h4>
                                        <div className="grid gap-5">
                                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                                {/* Title */}
                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor="title"
                                                        className="text-slate-600"
                                                    >
                                                        Nama Pelatihan{' '}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <Input
                                                        id="title"
                                                        name="title"
                                                        defaultValue={
                                                            editingTraining?.title ||
                                                            ''
                                                        }
                                                        placeholder="Contoh: Bootcamp React JS"
                                                        className="h-11 border-slate-200 focus-visible:ring-blue-500"
                                                    />
                                                    <InputError
                                                        message={errors.title}
                                                    />
                                                </div>

                                                {/* Institution */}
                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor="institution"
                                                        className="text-slate-600"
                                                    >
                                                        Institusi /
                                                        Penyelenggara
                                                    </Label>
                                                    <Input
                                                        id="institution"
                                                        name="institution"
                                                        defaultValue={
                                                            editingTraining?.institution ||
                                                            ''
                                                        }
                                                        placeholder="Contoh: Dicoding"
                                                        className="h-11 border-slate-200 focus-visible:ring-blue-500"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.institution
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Seksi Periode */}
                                    <div className="space-y-4">
                                        <h4 className="flex items-center gap-2 border-b border-slate-100 pb-2 text-sm font-semibold text-slate-900">
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-500">
                                                2
                                            </span>
                                            Periode Pelaksanaan
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
                                                <DatePicker
                                                    date={startDate}
                                                    setDate={setStartDate}
                                                    disabled={(date) =>
                                                        date > new Date()
                                                    }
                                                />
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
                                                        endDate
                                                            ? dayjs(
                                                                  endDate,
                                                              ).format(
                                                                  'YYYY-MM-DD',
                                                              )
                                                            : ''
                                                    }
                                                />
                                                <DatePicker
                                                    date={endDate}
                                                    setDate={setEndDate}
                                                    disabled={(date) =>
                                                        date > new Date() ||
                                                        (startDate
                                                            ? date < startDate
                                                            : false)
                                                    }
                                                />
                                                <InputError
                                                    message={errors.end_date}
                                                />
                                            </div>
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
                                                    Deskripsi / Materi
                                                </Label>
                                                <Textarea
                                                    id="description"
                                                    name="description"
                                                    defaultValue={
                                                        editingTraining?.description ||
                                                        ''
                                                    }
                                                    placeholder="Ceritakan materi apa saja yang Anda pelajari..."
                                                    className="min-h-[120px] resize-y border-slate-200 focus-visible:ring-blue-500"
                                                />
                                                <InputError
                                                    message={errors.description}
                                                />
                                            </div>

                                            {/* File */}
                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="file"
                                                    className="text-slate-600"
                                                >
                                                    Sertifikat Pelatihan
                                                    (Opsional)
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
                                                {editingTraining?.document && (
                                                    <p className="mt-1 text-xs text-blue-600">
                                                        Dokumen saat ini:{' '}
                                                        <a
                                                            href={`/documents/${editingTraining.document.id}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="font-medium underline hover:text-blue-800"
                                                        >
                                                            {editingTraining
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
                                            : 'Simpan Pelatihan'}
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
                title="Hapus Pelatihan?"
                description="Apakah Anda yakin ingin menghapus riwayat pelatihan ini? Dokumen terkait juga akan terhapus dan tindakan ini tidak dapat dibatalkan."
            />
        </Card>
    );
}
