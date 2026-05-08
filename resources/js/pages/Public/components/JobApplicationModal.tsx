import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JobDetailType } from '@/types/job';
import { toast } from 'sonner';
import { useForm } from '@inertiajs/react';
import JobApplicationController from '@/actions/App/Http/Controllers/Candidate/JobApplicationController';

interface JobQuestion {
    id: number;
    question: string;
    type: 'text' | 'boolean' | 'file' | 'multiple_choice';
    options: string[] | null;
    is_required: boolean;
}

interface CV {
    id: number;
    file_name: string;
    is_primary: boolean;
}

interface AuthCandidate {
    id: number;
    cvs: CV[];
}

interface JobApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobData: JobDetailType & { job_questions?: JobQuestion[] };
    authCandidate: AuthCandidate | null;
}

export function JobApplicationModal({ isOpen, onClose, jobData, authCandidate }: JobApplicationModalProps) {
    const primaryCv = authCandidate?.cvs?.find((cv) => cv.is_primary);
    const initialCvId = primaryCv ? primaryCv.id.toString() : '';

    // answers.answer_text untuk multiple_choice akan menyimpan nilai JSON array string
    const initialAnswers = (jobData.job_questions ?? []).map((q) => ({
        job_question_id: q.id,
        answer_text: q.type === 'multiple_choice' ? '[]' : '',
        file: null as File | null,
    }));

    const { data, setData, post, processing, errors, reset } = useForm<{
        cv_document_id: string;
        cover_letter: string;
        answers: { job_question_id: number; answer_text: string; file: File | null }[];
    }>({
        cv_document_id: initialCvId,
        cover_letter: '',
        answers: initialAnswers,
    });

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const routeConfig = JobApplicationController.store.form(jobData.id);

        post(routeConfig.action, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                toast.success('Lamaran Anda berhasil dikirim!');
                onClose();
            },
            onError: (err) => {
                console.error(err);
                toast.error('Terjadi kesalahan. Silakan periksa isian Anda.');
            },
        });
    };

    const updateAnswer = (index: number, field: 'answer_text' | 'file', value: string | File | null) => {
        const updated = [...data.answers];
        updated[index] = { ...updated[index], [field]: value };
        setData('answers', updated);
    };

    // Helper khusus untuk multiple_choice: toggle nilai dalam array
    const toggleMultipleChoice = (index: number, opt: string) => {
        const current: string[] = (() => {
            try {
                return JSON.parse(data.answers[index]?.answer_text || '[]');
            } catch {
                return [];
            }
        })();

        const updated = current.includes(opt)
            ? current.filter((v) => v !== opt)
            : [...current, opt];

        updateAnswer(index, 'answer_text', JSON.stringify(updated));
    };

    const getMultipleChoiceValues = (index: number): string[] => {
        try {
            return JSON.parse(data.answers[index]?.answer_text || '[]');
        } catch {
            return [];
        }
    };

    const hasCvs = authCandidate?.cvs && authCandidate.cvs.length > 0;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl border-0 shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-8 py-6 rounded-t-2xl">
                    <DialogHeader>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#0077b6]/10 flex items-center justify-center">
                                <svg className="w-5 h-5 text-[#0077b6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-slate-900 leading-tight">
                                    Lamar Posisi
                                </DialogTitle>
                                <p className="text-[#0077b6] font-semibold text-base mt-0.5">{jobData.title}</p>
                                <DialogDescription className="text-slate-500 text-sm mt-1">
                                    Lengkapi formulir di bawah untuk mengirimkan lamaran Anda.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="px-8 py-6 space-y-6">

                        {/* Bagian CV */}
                        <div className="space-y-2">
                            <Label htmlFor="cv_document_id" className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                                Curriculum Vitae (CV)
                                <span className="text-red-500">*</span>
                            </Label>
                            {hasCvs ? (
                                <Select
                                    value={data.cv_document_id}
                                    onValueChange={(val) => setData('cv_document_id', val)}
                                    required
                                >
                                    <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-[#0077b6]/30 focus:border-[#0077b6] w-full">
                                        <SelectValue placeholder="Pilih CV Anda" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {authCandidate!.cvs.map((cv) => (
                                            <SelectItem key={cv.id} value={cv.id.toString()}>
                                                {cv.file_name}{cv.is_primary ? ' (CV Utama)' : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <div className="flex items-start gap-3 text-sm text-red-700 bg-red-50 p-4 rounded-xl border border-red-200">
                                    <svg className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span>Anda belum mengunggah CV. Silakan ke halaman <strong>Profil</strong> untuk mengunggah CV terlebih dahulu.</span>
                                </div>
                            )}
                            {errors.cv_document_id && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    {errors.cv_document_id}
                                </p>
                            )}
                        </div>

                        {/* Bagian Cover Letter */}
                        <div className="space-y-2">
                            <Label htmlFor="cover_letter" className="text-sm font-semibold text-slate-700">
                                Surat Lamaran Pengantar
                                <span className="ml-1.5 text-xs font-normal text-slate-400">(Opsional)</span>
                            </Label>
                            <Textarea
                                id="cover_letter"
                                value={data.cover_letter}
                                onChange={(e) => setData('cover_letter', e.target.value)}
                                placeholder="Tuliskan alasan mengapa Anda cocok untuk posisi ini..."
                                className="min-h-[110px] rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0077b6]/30 focus:border-[#0077b6] transition-all resize-none"
                            />
                            {errors.cover_letter && (
                                <p className="text-xs text-red-500">{errors.cover_letter}</p>
                            )}
                        </div>

                        {/* Pertanyaan Dinamis HR */}
                        {jobData.job_questions && jobData.job_questions.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-px flex-1 bg-slate-100" />
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Pertanyaan Tambahan</span>
                                    <div className="h-px flex-1 bg-slate-100" />
                                </div>

                                {jobData.job_questions.map((q, index) => {
                                    const answerError =
                                        (errors as any)[`answers.${index}.answer_text`] ||
                                        (errors as any)[`answers.${index}.file`];
                                    const currentAnswer = data.answers[index]?.answer_text ?? '';
                                    const selectedOptions = getMultipleChoiceValues(index);

                                    return (
                                        <div
                                            key={q.id}
                                            className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-200"
                                        >
                                            <Label className="text-sm font-semibold text-slate-700 leading-snug">
                                                {q.question}
                                                {q.is_required && <span className="text-red-500 ml-1">*</span>}
                                            </Label>

                                            {q.type === 'text' && (
                                                <Textarea
                                                    value={currentAnswer}
                                                    onChange={(e) => updateAnswer(index, 'answer_text', e.target.value)}
                                                    placeholder="Jawaban Anda..."
                                                    required={q.is_required}
                                                    className="rounded-lg border-slate-200 bg-white text-sm focus:ring-2 focus:ring-[#0077b6]/30 focus:border-[#0077b6] transition-all resize-none"
                                                />
                                            )}

                                            {q.type === 'boolean' && (
                                                <RadioGroup
                                                    value={currentAnswer}
                                                    onValueChange={(val) => updateAnswer(index, 'answer_text', val)}
                                                    className="flex gap-3"
                                                >
                                                    {['Ya', 'Tidak'].map((opt) => (
                                                        <label
                                                            key={opt}
                                                            htmlFor={`q-${q.id}-${opt}`}
                                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer text-sm font-medium transition-all select-none ${
                                                                currentAnswer === opt
                                                                    ? 'bg-[#0077b6]/10 border-[#0077b6] text-[#0077b6]'
                                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                            }`}
                                                        >
                                                            <RadioGroupItem value={opt} id={`q-${q.id}-${opt}`} className="sr-only" />
                                                            {opt === 'Ya' ? (
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                            ) : (
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                            )}
                                                            {opt}
                                                        </label>
                                                    ))}
                                                </RadioGroup>
                                            )}

                                            {/* FIXED: Multiple choice kini mendukung pilihan lebih dari satu */}
                                            {q.type === 'multiple_choice' && q.options && (
                                                <div className="space-y-2">
                                                    {q.options.map((opt, i) => {
                                                        const isChecked = selectedOptions.includes(opt);
                                                        return (
                                                            <label
                                                                key={i}
                                                                htmlFor={`q-${q.id}-opt-${i}`}
                                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer text-sm transition-all select-none ${
                                                                    isChecked
                                                                        ? 'bg-[#0077b6]/10 border-[#0077b6] text-[#0077b6]'
                                                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                                }`}
                                                            >
                                                                <Checkbox
                                                                    id={`q-${q.id}-opt-${i}`}
                                                                    checked={isChecked}
                                                                    onCheckedChange={() => toggleMultipleChoice(index, opt)}
                                                                    className="flex-shrink-0"
                                                                />
                                                                <span className="font-medium">{opt}</span>
                                                            </label>
                                                        );
                                                    })}

                                                    {/* Hidden input untuk validasi native required */}
                                                    {q.is_required && (
                                                        <input
                                                            type="text"
                                                            className="h-0 w-0 opacity-0 absolute pointer-events-none"
                                                            value={selectedOptions.length > 0 ? 'filled' : ''}
                                                            onChange={() => {}}
                                                            required
                                                        />
                                                    )}

                                                    {selectedOptions.length > 0 && (
                                                        <p className="text-xs text-[#0077b6] mt-1">
                                                            {selectedOptions.length} pilihan dipilih
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {q.type === 'file' && (
                                                <div className="relative">
                                                    <Input
                                                        type="file"
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        required={q.is_required}
                                                        className="cursor-pointer bg-white rounded-lg border-slate-200 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[#0077b6] file:text-white file:text-xs file:font-medium file:px-3 file:py-1.5 hover:file:bg-[#0077b6]/90 transition-all"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0] ?? null;
                                                            updateAnswer(index, 'file', file);
                                                        }}
                                                    />
                                                    <p className="text-xs text-slate-400 mt-1.5">PDF, JPG, atau PNG — maks. ukuran wajar</p>
                                                </div>
                                            )}

                                            {answerError && (
                                                <p className="text-xs text-red-500 flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                    {answerError}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-white border-t border-slate-100 px-8 py-5 rounded-b-2xl">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-xs text-slate-400">
                                {hasCvs ? 'Semua field bertanda * wajib diisi' : 'Upload CV di halaman Profil terlebih dahulu'}
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={processing}
                                    className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 h-10 px-5 text-sm font-medium"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing || !hasCvs}
                                    className="rounded-xl bg-[#0077b6] hover:bg-[#005f94] text-white h-10 px-6 text-sm font-semibold shadow-sm shadow-[#0077b6]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Mengirim...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Kirim Lamaran
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}