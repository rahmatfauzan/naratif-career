import { Head, usePage } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DeleteUser from '@/components/delete-user';
import { index } from '@/routes/profile';
import {
    User,
    Mail,
    Phone,
    CalendarDays,
    CreditCard,
    Linkedin,
    Link as LinkIcon,
    MapPin,
    Edit2,
} from 'lucide-react';
import { useState } from 'react';
import ModalGlobal from '@/components/modal-global';
import UpdateCandidateProfileForm from '../components/UpdateCandidateProfileForm';
import CandidateSkill from '../components/CandidateSkill';
import CandidateLanguage from '../components/CandidateLanguage';
import CandidateEducation from '../components/CandidateEducation';
import CandidateExperience from '../components/CandidateExperience';
import CandidateTraining from '../components/CandidateTraining';
import CandidateCertification from '../components/CandidateCertification';
import CandidateCVManager from '../components/CandidateCVManager';

export default function ProfileIndex() {
    const { auth, candidateProfile } = usePage().props as any;
    const user = auth.user;
    const candidate = candidateProfile || {};
    const address = candidate.address || {};
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Warna biru yang lebih terang dan hidup (Sky Blue / Royal Blue)
    const brandColor = '#0077b6';

    return (
        <>
            <Head title="Profile Information" />

            <div className="mb-6">
                <Heading
                    variant="small"
                    title="Profil Anda"
                    description="Kelola informasi pribadi dan profesional Anda dalam satu tampilan."
                />
            </div>

            <Card className="w-full overflow-hidden border-slate-200 shadow-md">
                <CardContent className="p-0">
                    {/* ROW 1 — Header Profil (Warna Biru Terang) */}
                    <div className="flex flex-col items-center gap-6 border-b border-slate-100 bg-slate-50 px-6 py-8 sm:flex-row">
                        {/* Avatar */}
                        <div className="shrink-0">
                            {candidate.avatar_url ? (
                                <img
                                    src={`/storage/${candidate.avatar_url.replace('public/', '')}`}
                                    alt="Avatar"
                                    className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-sm ring-1 ring-slate-200"
                                />
                            ) : (
                                <div
                                    className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-white shadow-sm ring-1 ring-slate-200"
                                    style={{ color: brandColor }}
                                >
                                    <User className="h-12 w-12" />
                                </div>
                            )}
                        </div>

                        {/* Nama + Email + Link */}
                        <div className="min-w-0 flex-1 text-center sm:text-left">
                            <h3 className="truncate text-2xl font-bold text-slate-900">
                                {user.name || '-'}
                            </h3>
                            <div className="mt-1 flex items-center justify-center gap-2 text-sm text-slate-600 sm:justify-start">
                                <Mail
                                    className="h-4 w-4"
                                    style={{ color: brandColor }}
                                />
                                <span className="truncate">
                                    {user.email || '-'}
                                </span>
                            </div>

                            {(candidate.linkedin_url ||
                                candidate.portfolio_url) && (
                                <div className="mt-4 flex items-center justify-center gap-3 sm:justify-start">
                                    {candidate.linkedin_url && (
                                        <a
                                            href={candidate.linkedin_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-colors hover:border-blue-400 hover:text-blue-500"
                                        >
                                            <Linkedin className="h-4 w-4" />
                                        </a>
                                    )}
                                    {candidate.portfolio_url && (
                                        <a
                                            href={candidate.portfolio_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-colors hover:border-blue-400 hover:text-blue-500"
                                        >
                                            <LinkIcon className="h-4 w-4" />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Tombol Edit Modal */}
                        <ModalGlobal
                            isOpen={isEditModalOpen}
                            onOpenChange={setIsEditModalOpen}
                            title="Edit Profil Kandidat"
                            maxWidth="max-w-4xl"
                            trigger={
                                <Button
                                    className="shrink-0 shadow-sm transition-transform active:scale-95"
                                    style={{ backgroundColor: brandColor }}
                                >
                                    <Edit2 className="mr-2 h-4 w-4 text-white" />{' '}
                                    Edit Profil
                                </Button>
                            }
                        >
                            <UpdateCandidateProfileForm
                                onSuccess={() => setIsEditModalOpen(false)}
                            />
                        </ModalGlobal>
                    </div>

                    {/* ROW 2 — Ringkasan Profil (Normal / Biasa Saja) */}
                    <div className="border-b border-slate-100 bg-white px-8 py-6">
                        <p
                            className="mb-2 text-xs font-bold tracking-wider uppercase"
                            style={{ color: brandColor }}
                        >
                            Ringkasan Profil
                        </p>
                        <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-slate-700">
                            {candidate.summary ||
                                'Belum ada ringkasan profil yang ditambahkan.'}
                        </p>
                    </div>

                    {/* ROW 3 — Informasi Pribadi */}
                    <div className="bg-white px-8 py-8">
                        <p
                            className="mb-6 text-xs font-bold tracking-wider uppercase"
                            style={{ color: brandColor }}
                        >
                            Informasi Pribadi
                        </p>
                        <div className="grid grid-cols-1 gap-x-12 gap-y-6 sm:grid-cols-2">
                            <InfoItem
                                brandColor={brandColor}
                                icon={<Phone className="h-4 w-4" />}
                                label="Nomor Telepon"
                                value={candidate.phone}
                            />

                            <InfoItem
                                brandColor={brandColor}
                                icon={<CalendarDays className="h-4 w-4" />}
                                label="Tanggal Lahir"
                                value={
                                    candidate.date_of_birth
                                        ? new Date(
                                              candidate.date_of_birth,
                                          ).toLocaleDateString('id-ID', {
                                              day: 'numeric',
                                              month: 'long',
                                              year: 'numeric',
                                          })
                                        : null
                                }
                            />

                            <InfoItem
                                brandColor={brandColor}
                                icon={<User className="h-4 w-4" />}
                                label="Jenis Kelamin"
                                value={
                                    candidate.gender === 'male'
                                        ? 'Laki-laki'
                                        : candidate.gender === 'female'
                                          ? 'Perempuan'
                                          : null
                                }
                            />

                            <InfoItem
                                brandColor={brandColor}
                                icon={<CreditCard className="h-4 w-4" />}
                                label="NIK (KTP)"
                                value={candidate.nik}
                            />

                            <div className="col-span-full pt-2">
                                <div className="mb-1 flex items-center gap-2">
                                    <MapPin
                                        className="h-4 w-4"
                                        style={{ color: brandColor }}
                                    />
                                    <span className="text-[13px] font-medium text-slate-500">
                                        Alamat Lengkap
                                    </span>
                                </div>
                                <p className="pl-6 text-[15px] leading-relaxed text-slate-900">
                                    {address.full_address ||
                                        'Belum ada alamat yang ditambahkan.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-6 space-y-6">
                <CandidateCVManager />
                <CandidateExperience />
                <CandidateEducation />
                <CandidateTraining />
                <CandidateCertification />
                <CandidateSkill />
                <CandidateLanguage />
            </div>
        </>
    );
}

function InfoItem({
    brandColor,
    icon,
    label,
    value,
}: {
    brandColor: string;
    icon: React.ReactNode;
    label: string;
    value: string | null;
}) {
    return (
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                <span style={{ color: brandColor }}>{icon}</span>
                <span className="text-[13px] font-medium text-slate-500">
                    {label}
                </span>
            </div>
            <p className="pl-6 text-[15px] font-semibold text-slate-900">
                {value || '-'}
            </p>
        </div>
    );
}

ProfileIndex.layout = {
    breadcrumbs: [{ title: 'Profile settings', href: index() }],
};
