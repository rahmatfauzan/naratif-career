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
import ConfirmModal from '@/components/confirm-modal';
import {
    Plus,
    Trash2,
    Edit2,
    Award,
    FileText,
    ExternalLink,
} from 'lucide-react';
import InputError from '@/components/input-error';
import { DatePicker } from '@/components/date-picker';
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

import * as CertificationController from '@/actions/App/Http/Controllers/Candidate/CertificationController';

type Document = {
    id: number;
    file_path: string;
    file_name: string;
    file_type: string;
};

type Certification = {
    id: number;
    name: string;
    issuer: string | null;
    credential_id: string | null;
    credential_url: string | null;
    issued_date: string | null;
    expired_date: string | null;
    document_id: number | null;
    document?: Document | null;
};

type PageProps = {
    candidateProfile: {
        certifications: Certification[];
    };
};

export default function CandidateCertification() {
    const { candidateProfile } = usePage<PageProps>().props;
    const certifications = candidateProfile?.certifications ?? [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCertification, setEditingCertification] =
        useState<Certification | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // UI States for Form
    const [issuedDate, setIssuedDate] = useState<Date | null>(null);
    const [expiredDate, setExpiredDate] = useState<Date | null>(null);

    const openAddModal = () => {
        setEditingCertification(null);
        setIssuedDate(null);
        setExpiredDate(null);
        setIsModalOpen(true);
    };

    const openEditModal = (certification: Certification) => {
        setEditingCertification(certification);
        setIssuedDate(
            certification.issued_date
                ? new Date(certification.issued_date)
                : null,
        );
        setExpiredDate(
            certification.expired_date
                ? new Date(certification.expired_date)
                : null,
        );
        setIsModalOpen(true);
    };

    const onSuccess = () => {
        setIsModalOpen(false);
    };

    const handleDelete = (id: number) => {
        router.delete(
            CertificationController.destroy.url({ certification: id }),
            {
                preserveScroll: true,
            },
        );
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
                            <Award className="h-5 w-5 text-[#0077b6]" />
                            Sertifikasi
                        </CardTitle>
                        <CardDescription>
                            Tambahkan sertifikasi profesional yang Anda miliki.
                        </CardDescription>
                    </div>
                    <Button
                        onClick={openAddModal}
                        className="shrink-0 rounded-md bg-[#0077b6] text-white shadow-sm transition-all hover:bg-[#005f92]"
                        size="sm"
                    >
                        <Plus className="mr-1.5 h-4 w-4" />
                        Tambah Sertifikasi
                    </Button>
                </div>
            </CardHeader>

            {/* ── Certification List ── */}
            <CardContent>
                <div className="relative space-y-4 before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-slate-200">
                    {certifications.length === 0 ? (
                        <p className="pl-8 text-sm text-slate-400">
                            Belum ada riwayat sertifikasi yang ditambahkan.
                        </p>
                    ) : (
                        certifications.map((certification) => (
                            <div
                                key={certification.id}
                                className="group relative flex items-start pl-8 transition-all"
                            >
                                {/* Pipeline Dot */}
                                <div className="absolute top-1/2 left-[11px] h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-[#0077b6] ring-2 ring-blue-100" />

                                <div className="flex w-full flex-col justify-between gap-4 py-3 transition-all sm:flex-row sm:items-start">
                                    <div className="flex w-full flex-col">
                                        <div className="flex w-full items-start justify-between">
                                            <div>
                                                <h4 className="text-base font-bold text-slate-800">
                                                    {certification.name}
                                                </h4>
                                                {certification.issuer && (
                                                    <div className="mt-0.5 text-sm font-medium text-blue-700">
                                                        {certification.issuer}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                                    onClick={() =>
                                                        openEditModal(
                                                            certification,
                                                        )
                                                    }
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                                    onClick={() =>
                                                        setDeleteId(
                                                            certification.id,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {(certification.issued_date ||
                                            certification.expired_date) && (
                                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                                <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 font-semibold text-blue-700">
                                                    Diterbitkan:{' '}
                                                    {formatDate(
                                                        certification.issued_date,
                                                    ) || '-'}
                                                    {certification.expired_date
                                                        ? ` • Berlaku hingga: ${formatDate(certification.expired_date)}`
                                                        : ' • Tidak ada kedaluwarsa'}
                                                </span>
                                            </div>
                                        )}

                                        {certification.credential_id && (
                                            <div className="mt-2 text-sm text-slate-600">
                                                ID Kredensial:{' '}
                                                <span className="font-medium text-slate-800">
                                                    {
                                                        certification.credential_id
                                                    }
                                                </span>
                                            </div>
                                        )}

                                        <div className="mt-4 flex flex-wrap gap-3">
                                            {certification.document && (
                                                <a
                                                    href={`/documents/${certification.document.id}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-blue-600 transition-colors hover:border-blue-200 hover:bg-blue-50"
                                                >
                                                    <FileText className="h-4 w-4 text-blue-500" />
                                                    {certification.document
                                                        .file_name ||
                                                        'Lihat Sertifikat'}
                                                </a>
                                            )}

                                            {certification.credential_url && (
                                                <a
                                                    href={
                                                        certification.credential_url
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100"
                                                >
                                                    <ExternalLink className="h-4 w-4 text-slate-500" />
                                                    Lihat Kredensial
                                                </a>
                                            )}
                                        </div>
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
                        {...(editingCertification
                            ? CertificationController.update.form({
                                  certification: editingCertification.id,
                              })
                            : CertificationController.store.form())}
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
                                                <Award className="h-6 w-6" />
                                            </div>
                                            <div className="flex flex-col gap-1 text-left">
                                                <span>
                                                    {editingCertification
                                                        ? 'Edit Sertifikasi'
                                                        : 'Tambah Sertifikasi Baru'}
                                                </span>
                                                <DialogDescription className="text-sm font-normal text-slate-500">
                                                    Detail sertifikasi yang Anda
                                                    miliki.
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
                                            Informasi Sertifikasi
                                        </h4>
                                        <div className="grid gap-5">
                                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                                {/* Name */}
                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor="name"
                                                        className="text-slate-600"
                                                    >
                                                        Nama Sertifikasi{' '}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        defaultValue={
                                                            editingCertification?.name ||
                                                            ''
                                                        }
                                                        placeholder="Contoh: AWS Certified Developer"
                                                        className="h-11 border-slate-200 focus-visible:ring-blue-500"
                                                    />
                                                    <InputError
                                                        message={errors.name}
                                                    />
                                                </div>

                                                {/* Issuer */}
                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor="issuer"
                                                        className="text-slate-600"
                                                    >
                                                        Organisasi Penerbit
                                                    </Label>
                                                    <Input
                                                        id="issuer"
                                                        name="issuer"
                                                        defaultValue={
                                                            editingCertification?.issuer ||
                                                            ''
                                                        }
                                                        placeholder="Contoh: Amazon Web Services"
                                                        className="h-11 border-slate-200 focus-visible:ring-blue-500"
                                                    />
                                                    <InputError
                                                        message={errors.issuer}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Seksi Kredensial */}
                                    <div className="space-y-4">
                                        <h4 className="flex items-center gap-2 border-b border-slate-100 pb-2 text-sm font-semibold text-slate-900">
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-500">
                                                2
                                            </span>
                                            ID & Link Kredensial
                                        </h4>
                                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                            {/* Credential ID */}
                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="credential_id"
                                                    className="text-slate-600"
                                                >
                                                    ID Kredensial (Opsional)
                                                </Label>
                                                <Input
                                                    id="credential_id"
                                                    name="credential_id"
                                                    defaultValue={
                                                        editingCertification?.credential_id ||
                                                        ''
                                                    }
                                                    placeholder="Contoh: AWS-12345"
                                                    className="h-11 border-slate-200 focus-visible:ring-blue-500"
                                                />
                                                <InputError
                                                    message={
                                                        errors.credential_id
                                                    }
                                                />
                                            </div>

                                            {/* Credential URL */}
                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="credential_url"
                                                    className="text-slate-600"
                                                >
                                                    URL Kredensial (Opsional)
                                                </Label>
                                                <Input
                                                    id="credential_url"
                                                    name="credential_url"
                                                    type="url"
                                                    defaultValue={
                                                        editingCertification?.credential_url ||
                                                        ''
                                                    }
                                                    placeholder="https://..."
                                                    className="h-11 border-slate-200 focus-visible:ring-blue-500"
                                                />
                                                <InputError
                                                    message={
                                                        errors.credential_url
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Seksi Periode & Dokumen */}
                                    <div className="space-y-4">
                                        <h4 className="flex items-center gap-2 border-b border-slate-100 pb-2 text-sm font-semibold text-slate-900">
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-500">
                                                3
                                            </span>
                                            Periode & Dokumen Bukti
                                        </h4>
                                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                            {/* Issued Date */}
                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="issued_date"
                                                    className="text-slate-600"
                                                >
                                                    Tanggal Terbit
                                                </Label>
                                                <input
                                                    type="hidden"
                                                    name="issued_date"
                                                    value={
                                                        issuedDate
                                                            ? dayjs(
                                                                  issuedDate,
                                                              ).format(
                                                                  'YYYY-MM-DD',
                                                              )
                                                            : ''
                                                    }
                                                />
                                                <DatePicker
                                                    date={issuedDate}
                                                    setDate={setIssuedDate}
                                                    disabled={(date) =>
                                                        date > new Date()
                                                    }
                                                />
                                                <InputError
                                                    message={errors.issued_date}
                                                />
                                            </div>

                                            {/* Expired Date */}
                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="expired_date"
                                                    className="text-slate-600"
                                                >
                                                    Tanggal Kedaluwarsa
                                                </Label>
                                                <input
                                                    type="hidden"
                                                    name="expired_date"
                                                    value={
                                                        expiredDate
                                                            ? dayjs(
                                                                  expiredDate,
                                                              ).format(
                                                                  'YYYY-MM-DD',
                                                              )
                                                            : ''
                                                    }
                                                />
                                                <DatePicker
                                                    date={expiredDate}
                                                    setDate={setExpiredDate}
                                                    placeholder="Tidak ada kedaluwarsa"
                                                />
                                                <InputError
                                                    message={
                                                        errors.expired_date
                                                    }
                                                />
                                            </div>

                                            {/* File */}
                                            <div className="grid gap-2 md:col-span-2">
                                                <Label
                                                    htmlFor="file"
                                                    className="text-slate-600"
                                                >
                                                    File Sertifikat (Opsional)
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
                                                {editingCertification?.document && (
                                                    <p className="mt-1 text-xs text-blue-600">
                                                        Dokumen saat ini:{' '}
                                                        <a
                                                            href={`/documents/${editingCertification.document.id}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="font-medium underline hover:text-blue-800"
                                                        >
                                                            {editingCertification
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
                                            : 'Simpan Sertifikasi'}
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
                title="Hapus Sertifikasi?"
                description="Apakah Anda yakin ingin menghapus riwayat sertifikasi ini? Dokumen terkait juga akan terhapus dan tindakan ini tidak dapat dibatalkan."
            />
        </Card>
    );
}
