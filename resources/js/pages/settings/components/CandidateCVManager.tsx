import { useState, useRef } from 'react';
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
import { FileText, UploadCloud, Trash2, Star, CheckCircle2 } from 'lucide-react';
import InputError from '@/components/input-error';

import * as CvController from '@/actions/App/Http/Controllers/Candidate/CvController';

type Document = {
    id: number;
    file_path: string;
    file_name: string;
    document_type: string;
};

type PageProps = {
    candidateProfile: {
        default_cv_id: number | null;
        documents: Document[];
    };
    errors: Record<string, string>;
};

export default function CandidateCVManager() {
    const { candidateProfile, errors } = usePage<PageProps>().props;
    const documents = candidateProfile?.documents ?? [];
    const cvs = documents.filter((doc) => doc.document_type === 'cv');
    const defaultCvId = candidateProfile?.default_cv_id;

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);

        router.post(
            CvController.store.url(),
            {
                file: file,
            },
            {
                preserveScroll: true,
                forceFormData: true,
                onFinish: () => {
                    setUploading(false);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                },
            }
        );
    };

    const handleDelete = (id: number) => {
        router.delete(CvController.destroy.url({ cv: id }), {
            preserveScroll: true,
        });
    };

    const handleSetPrimary = (id: number) => {
        router.patch(CvController.setPrimary.url({ cv: id }), {}, {
            preserveScroll: true,
        });
    };

    return (
        <Card>
            {/* ── Header ── */}
            <CardHeader className="pb-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="space-y-1 pr-4">
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-[#0077b6]" />
                            Curriculum Vitae (CV)
                        </CardTitle>
                        <CardDescription>
                            Unggah CV Anda (Maksimal 3 CV). Format PDF dengan ukuran maksimal 5MB.
                        </CardDescription>
                    </div>
                    {cvs.length < 3 && (
                        <div className="shrink-0">
                            <Input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="w-full sm:w-auto rounded-md bg-[#0077b6] text-white shadow-sm transition-all hover:bg-[#005f92]"
                                size="sm"
                            >
                                <UploadCloud className="mr-1.5 h-4 w-4" />
                                {uploading ? 'Mengunggah...' : 'Upload CV'}
                            </Button>
                        </div>
                    )}
                </div>
                {errors?.file && (
                    <div className="mt-2 text-sm font-medium text-red-600">
                        {errors.file}
                    </div>
                )}
            </CardHeader>

            {/* ── CV List ── */}
            <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {cvs.length === 0 ? (
                        <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center">
                            <p className="text-sm text-slate-500">
                                Belum ada CV yang diunggah. Silakan upload CV pertama Anda.
                            </p>
                        </div>
                    ) : (
                        cvs.map((cv) => {
                            const isPrimary = cv.id === defaultCvId;

                            return (
                                <div
                                    key={cv.id}
                                    className={`relative flex flex-col justify-between gap-4 rounded-xl border p-5 transition-all ${
                                        isPrimary
                                            ? 'border-blue-200 bg-blue-50/50 shadow-sm ring-1 ring-blue-100'
                                            : 'border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm'
                                    }`}
                                >
                                    {isPrimary && (
                                        <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 ring-4 ring-white shadow-sm">
                                            <CheckCircle2 className="h-5 w-5" />
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="truncate text-sm font-semibold text-slate-800" title={cv.file_name}>
                                                {cv.file_name}
                                            </h4>
                                            <a
                                                href={`/documents/${cv.id}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-0.5 inline-block text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                Lihat Dokumen
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                        {!isPrimary ? (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleSetPrimary(cv.id)}
                                                className="flex-1 h-8 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                                            >
                                                <Star className="mr-1.5 h-3.5 w-3.5" />
                                                Jadikan Utama
                                            </Button>
                                        ) : (
                                            <div className="flex-1 text-center text-xs font-bold text-blue-700">
                                                CV Utama
                                            </div>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setDeleteId(cv.id)}
                                            className="h-8 w-8 shrink-0 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })
                    )}
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
                title="Hapus CV?"
                description="Apakah Anda yakin ingin menghapus CV ini? Jika ini adalah CV utama, CV lain akan otomatis terpilih menjadi utama."
            />
        </Card>
    );
}