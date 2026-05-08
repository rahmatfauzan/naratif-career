import { Form, usePage } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import ProfileController from '@/actions/App/Http/Controllers/Candidate/ProfileController';
import { User, MapPin, Briefcase, Camera, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

type Region = { code: string; name: string };

export default function UpdateCandidateProfileForm({
    onSuccess,
}: {
    onSuccess?: () => void;
}) {
    const { auth, candidateProfile, regionData } = usePage().props as any;
    const user = auth.user;
    const candidate = candidateProfile || {};
    const address = candidate.address || {};

    const [provinces, setProvinces] = useState<Region[]>(
        regionData?.provinces || [],
    );
    const [regencies, setRegencies] = useState<Region[]>(
        regionData?.regencies || [],
    );
    const [districts, setDistricts] = useState<Region[]>(
        regionData?.districts || [],
    );
    const [villages, setVillages] = useState<Region[]>(
        regionData?.villages || [],
    );

    const initialProv = address.region_code
        ? address.region_code.split('.')[0]
        : '';
    const initialReg =
        address.region_code && address.region_code.split('.').length >= 2
            ? address.region_code.split('.').slice(0, 2).join('.')
            : '';
    const initialDist =
        address.region_code && address.region_code.split('.').length >= 3
            ? address.region_code.split('.').slice(0, 3).join('.')
            : '';
    const initialVill =
        address.region_code && address.region_code.split('.').length >= 4
            ? address.region_code
            : '';

    const [selectedProv, setSelectedProv] = useState<string>(initialProv);
    const [selectedReg, setSelectedReg] = useState<string>(initialReg);
    const [selectedDist, setSelectedDist] = useState<string>(initialDist);
    const [selectedVill, setSelectedVill] = useState<string>(initialVill);

    const [autoAddress, setAutoAddress] = useState<string>(
        address.full_address || '',
    );

    // Update full_address automatically based on selected regions
    useEffect(() => {
        // Jangan timpa full_address yang sudah ada dari database di render pertama,
        // kecuali jika user secara aktif mulai mengubah dropdown.
        if (!selectedProv && !selectedReg && !selectedDist && !selectedVill)
            return;

        const provName = provinces.find((p) => p.code === selectedProv)?.name;
        const regName = regencies.find((r) => r.code === selectedReg)?.name;
        const distName = districts.find((d) => d.code === selectedDist)?.name;
        const villName = villages.find((v) => v.code === selectedVill)?.name;

        const parts = [villName, distName, regName, provName].filter(Boolean);

        // Cek jika bagian sudah lengkap atau jika user baru mulai mengganti alamat
        if (parts.length > 0) {
            setAutoAddress(parts.join(', '));
        }
    }, [
        selectedProv,
        selectedReg,
        selectedDist,
        selectedVill,
        provinces,
        regencies,
        districts,
        villages,
    ]);

    const fetchRegion = async (
        type: string,
        code: string,
        setter: React.Dispatch<React.SetStateAction<Region[]>>,
    ) => {
        try {
            const response = await axios.get(`/api/wilayah/${type}/${code}`);
            setter(response.data.data || []);
        } catch (error) {
            console.error(`Failed to fetch ${type}:`, error);
            setter([]);
        }
    };

    const handleProvChange = (val: string) => {
        setSelectedProv(val);
        setSelectedReg('');
        setSelectedDist('');
        setSelectedVill('');
        setRegencies([]);
        setDistricts([]);
        setVillages([]);
        if (val) fetchRegion('regencies', val, setRegencies);
    };

    const handleRegChange = (val: string) => {
        setSelectedReg(val);
        setSelectedDist('');
        setSelectedVill('');
        setDistricts([]);
        setVillages([]);
        if (val) fetchRegion('districts', val, setDistricts);
    };

    const handleDistChange = (val: string) => {
        setSelectedDist(val);
        setSelectedVill('');
        setVillages([]);
        if (val) fetchRegion('villages', val, setVillages);
    };

    const handleVillChange = (val: string) => {
        setSelectedVill(val);
    };

    const brandColor = '#0077b6';

    return (
        <div className="mx-auto max-h-[80vh] w-full overflow-y-auto pr-2">
            <Form
                {...ProfileController.update.form()}
                options={{
                    preserveScroll: true,
                }}
                onSuccess={onSuccess}
                encType="multipart/form-data"
            >
                {({ processing, errors }) => (
                    <>
                        {/* Content Wrapper */}
                        <div className="space-y-10 pb-5">
                            {/* SECTION 1: Personal Info */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                                    <User
                                        className="h-5 w-5"
                                        style={{ color: brandColor }}
                                    />
                                    <h3 className="text-xs font-bold tracking-wider text-slate-800 uppercase">
                                        Informasi Pribadi
                                    </h3>
                                </div>

                                {/* Avatar Upload */}
                                <div className="flex items-center gap-6 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                                    <div className="relative shrink-0">
                                        <img
                                            src={
                                                candidate.avatar_url
                                                    ? `/storage/${candidate.avatar_url.replace('public/', '')}`
                                                    : '/images/default-avatar.png'
                                            }
                                            alt="Avatar"
                                            className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-sm ring-1 ring-slate-200"
                                        />
                                        <div className="absolute -right-1 -bottom-1 rounded-full border border-slate-100 bg-white p-1.5 shadow-sm">
                                            <Camera className="h-3 w-3 text-slate-500" />
                                        </div>
                                    </div>
                                    <div className="grid flex-1 gap-1.5">
                                        <Label
                                            htmlFor="avatar"
                                            className="text-sm font-bold text-slate-700"
                                        >
                                            Foto Profil
                                        </Label>
                                        <Input
                                            id="avatar"
                                            name="avatar"
                                            type="file"
                                            accept="image/*"
                                            className="max-w-xs border-slate-200 bg-white file:font-semibold file:text-slate-600"
                                        />
                                        <InputError message={errors.avatar} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="grid gap-2 md:col-span-2">
                                        <Label
                                            htmlFor="name"
                                            className="text-[13px] font-bold text-slate-600"
                                        >
                                            Nama Lengkap
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={user.name || ''}
                                            required
                                            className="border-slate-200 focus:border-blue-400"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="phone"
                                            className="text-[13px] font-bold text-slate-600"
                                        >
                                            Nomor Telepon
                                        </Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            defaultValue={candidate.phone || ''}
                                            placeholder="0812xxxx"
                                            className="border-slate-200"
                                        />
                                        <InputError message={errors.phone} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="date_of_birth"
                                            className="text-[13px] font-bold text-slate-600"
                                        >
                                            Tanggal Lahir
                                        </Label>
                                        <Input
                                            id="date_of_birth"
                                            name="date_of_birth"
                                            type="date"
                                            defaultValue={
                                                candidate.date_of_birth
                                                    ? candidate.date_of_birth.split(
                                                          'T',
                                                      )[0]
                                                    : ''
                                            }
                                            className="w-full border-slate-200"
                                        />
                                        <InputError
                                            message={errors.date_of_birth}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="gender"
                                            className="text-[13px] font-bold text-slate-600"
                                        >
                                            Jenis Kelamin
                                        </Label>
                                        <Select
                                            name="gender"
                                            defaultValue={
                                                candidate.gender || undefined
                                            }
                                        >
                                            <SelectTrigger
                                                id="gender"
                                                className="w-full border-slate-200"
                                            >
                                                <SelectValue placeholder="Pilih Jenis Kelamin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">
                                                    Laki-laki
                                                </SelectItem>
                                                <SelectItem value="female">
                                                    Perempuan
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.gender} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="nik"
                                            className="text-[13px] font-bold text-slate-600"
                                        >
                                            NIK (KTP)
                                        </Label>
                                        <Input
                                            id="nik"
                                            name="nik"
                                            defaultValue={candidate.nik || ''}
                                            className="border-slate-200"
                                        />
                                        <InputError message={errors.nik} />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 2: Professional Info */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                                    <Briefcase
                                        className="h-5 w-5"
                                        style={{ color: brandColor }}
                                    />
                                    <h3 className="text-xs font-bold tracking-wider text-slate-800 uppercase">
                                        Informasi Profesional
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="linkedin_url"
                                            className="text-[13px] font-bold text-slate-600"
                                        >
                                            LinkedIn URL
                                        </Label>
                                        <Input
                                            id="linkedin_url"
                                            name="linkedin_url"
                                            type="url"
                                            defaultValue={
                                                candidate.linkedin_url || ''
                                            }
                                            className="border-slate-200"
                                        />
                                        <InputError
                                            message={errors.linkedin_url}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="portfolio_url"
                                            className="text-[13px] font-bold text-slate-600"
                                        >
                                            Portfolio URL
                                        </Label>
                                        <Input
                                            id="portfolio_url"
                                            name="portfolio_url"
                                            type="url"
                                            defaultValue={
                                                candidate.portfolio_url || ''
                                            }
                                            className="border-slate-200"
                                        />
                                        <InputError
                                            message={errors.portfolio_url}
                                        />
                                    </div>

                                    <div className="grid gap-2 md:col-span-2">
                                        <Label
                                            htmlFor="summary"
                                            className="text-[13px] font-bold text-slate-600"
                                        >
                                            Ringkasan Profil
                                        </Label>
                                        <Textarea
                                            id="summary"
                                            name="summary"
                                            defaultValue={
                                                candidate.summary || ''
                                            }
                                            rows={4}
                                            className="resize-none border-slate-200"
                                        />
                                        <InputError message={errors.summary} />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 3: Address */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                                    <MapPin
                                        className="h-5 w-5"
                                        style={{ color: brandColor }}
                                    />
                                    <h3 className="text-xs font-bold tracking-wider text-slate-800 uppercase">
                                        Alamat Lengkap
                                    </h3>
                                </div>

                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="full_address"
                                            className="text-[13px] font-bold text-slate-600"
                                        >
                                            Alamat Detail
                                        </Label>
                                        <Textarea
                                            id="full_address"
                                            name="address[full_address]"
                                            value={autoAddress}
                                            readOnly
                                            className="cursor-not-allowed resize-none border-slate-200 bg-slate-50 text-slate-500"
                                        />
                                        <InputError
                                            message={
                                                (errors as any)[
                                                    'address.full_address'
                                                ]
                                            }
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {/* Dropdown Provinsi */}
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="prov_code"
                                                className="text-[13px] font-bold text-slate-600"
                                            >
                                                Provinsi
                                            </Label>
                                            <Select
                                                value={selectedProv}
                                                onValueChange={handleProvChange}
                                            >
                                                <SelectTrigger className="border-slate-200 w-full">
                                                    <SelectValue placeholder="Pilih Provinsi" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {provinces.map((prov) => (
                                                        <SelectItem
                                                            key={prov.code}
                                                            value={prov.code}
                                                        >
                                                            {prov.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Dropdown Kabupaten/Kota */}
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="reg_code"
                                                className="text-[13px] font-bold text-slate-600"
                                            >
                                                Kabupaten / Kota
                                            </Label>
                                            <Select
                                                value={selectedReg}
                                                onValueChange={handleRegChange}
                                                disabled={!selectedProv}
                                            >
                                                <SelectTrigger className="border-slate-200 w-full">
                                                    <SelectValue placeholder="Pilih Kabupaten/Kota" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {regencies.map((reg) => (
                                                        <SelectItem
                                                            key={reg.code}
                                                            value={reg.code}
                                                        >
                                                            {reg.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Dropdown Kecamatan */}
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="dist_code"
                                                className="text-[13px] font-bold text-slate-600"
                                            >
                                                Kecamatan
                                            </Label>
                                            <Select
                                                value={selectedDist}
                                                onValueChange={handleDistChange}
                                                disabled={!selectedReg}
                                            >
                                                <SelectTrigger className="border-slate-200 w-full">
                                                    <SelectValue placeholder="Pilih Kecamatan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {districts.map((dist) => (
                                                        <SelectItem
                                                            key={dist.code}
                                                            value={dist.code}
                                                        >
                                                            {dist.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Dropdown Desa/Kelurahan */}
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="vill_code"
                                                className="text-[13px] font-bold text-slate-600"
                                            >
                                                Desa / Kelurahan
                                            </Label>
                                            <Select
                                                value={selectedVill}
                                                onValueChange={handleVillChange}
                                                disabled={!selectedDist}
                                            >
                                                <SelectTrigger className="border-slate-200 w-full">
                                                    <SelectValue placeholder="Pilih Desa/Kelurahan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {villages.map((vill) => (
                                                        <SelectItem
                                                            key={vill.code}
                                                            value={vill.code}
                                                        >
                                                            {vill.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {/* Hidden input to submit the final region_code */}
                                            <input
                                                type="hidden"
                                                name="address[region_code]"
                                                value={selectedVill}
                                            />
                                            <InputError
                                                message={
                                                    (errors as any)[
                                                        'address.region_code'
                                                    ]
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="postal_code"
                                                className="text-[13px] font-bold text-slate-600"
                                            >
                                                Kode Pos
                                            </Label>
                                            <Input
                                                id="postal_code"
                                                name="address[postal_code]"
                                                defaultValue={
                                                    address.postal_code || ''
                                                }
                                                className="border-slate-200"
                                            />
                                            <InputError
                                                message={
                                                    (errors as any)[
                                                        'address.postal_code'
                                                    ]
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Action - Full Width Button */}
                        <div className="border-t border-slate-100 bg-slate-50">
                            <Button
                                disabled={processing}
                                className="w-full shadow-lg transition-all active:scale-[0.98]"
                                style={{ backgroundColor: brandColor }}
                            >
                                <Save className="mr-2 h-5 w-5 text-white/80" />
                                {processing
                                    ? 'Menyimpan...'
                                    : 'Simpan Profil Kandidat'}
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </div>
    );
}
