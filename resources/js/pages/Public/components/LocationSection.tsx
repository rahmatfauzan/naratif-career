import Icon from '@/components/icon/icon';
import { ICONS } from '@/components/icon/iconData';
import { MapPin, ArrowUpRight } from 'lucide-react';
const transportList = [
    {
        id: 1,
        title: 'Stasiun Sudirman (MRT/KRL)',
        distance: '300m',
        icon: ICONS.kereta,
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-50',
        distanceColor: 'text-blue-600',
    },
    {
        id: 2,
        title: 'Halte Transjakarta',
        distance: '200m',
        icon: ICONS.bus,
        iconColor: 'text-orange-500',
        iconBg: 'bg-orange-50',
        distanceColor: 'text-blue-600',
    },
    {
        id: 3,
        title: 'Area Parkir Umum',
        distance: 'Tersedia',
        icon: ICONS.mobil,
        iconColor: 'text-green-600',
        iconBg: 'bg-green-50',
        distanceColor: 'text-green-600',
    },
];

export default function LocationSection() {
    return (
        <section className="container mx-auto my-[10vh]">
            <div className="mb-[20vh] text-center">
                <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
                    Lokasi Kami
                </h2>
                <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
                    Temui tim kami di Jakarta. Kami siap membantu Anda langsung
                    dari kantor kami.
                </p>
            </div>

            <div className="relative flex min-h-125 w-full items-center overflow-hidden rounded-3xl bg-[#1E1E1E] p-8 shadow-2xl md:p-16">
                <img
                    src="assets/images/nnnn.png"
                    className="absolute top-0 right-0 hidden h-full w-[60%] object-cover object-right opacity-30 md:block"
                    alt=""
                />

                <img
                    src="assets/images/jkt.png"
                    className="absolute bottom-0 left-0 w-[80%] max-w-100 object-contain opacity-70"
                    alt=""
                />

                <Icon
                    {...ICONS.naruto}
                    size={100}
                    className="absolute -top-8 -left-8 text-[#D96131]"
                />
                <Icon
                    {...ICONS.garisAbstract1}
                    size={120}
                    className="absolute -top-10 -right-10 text-[#C223A4]"
                />
                <Icon
                    {...ICONS.bunga}
                    size={100}
                    className="absolute -bottom-4 -left-6 text-[#F34D8A]"
                />
                <Icon
                    {...ICONS.kembang}
                    size={150}
                    className="absolute -right-12 -bottom-12 text-[#2481FF]"
                />

                <div className="relative z-10 flex w-full flex-col justify-between gap-12 md:flex-row md:items-center">
                    <div className="flex max-w-xl flex-col items-start">
                        <span className="mb-2 text-lg font-bold tracking-widest text-[#D1F916]">
                            KOTA
                        </span>

                        <div className="mb-6 flex flex-wrap items-center gap-6">
                            <h3 className="text-6xl font-bold tracking-tight text-white md:text-7xl">
                                Jakarta
                            </h3>

                            <button className="flex items-center gap-2.5 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black shadow-lg md:text-base">
                                <MapPin size={18} className="text-[#6441FF]" />
                                <span>Cek Maps</span>
                                <ArrowUpRight
                                    size={18}
                                    className="text-gray-600"
                                />
                            </button>
                        </div>

                        <p className="mb-8 text-xl leading-relaxed text-gray-200">
                            Jl. Sudirman No. 123, Keb. Baru, Kec. Tanah Abang,
                            Jakarta Pusat 12910
                        </p>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-gray-300">
                                <Icon
                                    {...ICONS.phone}
                                    size={20}
                                    className="text-[#D1F916]"
                                />
                                <span className="text-lg">
                                    +62 21 1234 5678
                                </span>
                            </div>

                            <div className="flex items-center gap-3 text-gray-300">
                                <Icon
                                    {...ICONS.email}
                                    size={20}
                                    className="text-[#D1F916]"
                                />
                                <span className="text-lg">
                                    hello@naratif.agency
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative hidden w-full max-w-117.5 overflow-hidden bg-black px-7 py-8 text-white shadow-[0_24px_60px_rgba(0,0,0,0.35)] md:px-8 md:py-9 lg:block">
                        <div className="absolute top-0 left-0 h-8 w-8 bg-[#3186ff]" />
                        <div className="absolute bottom-0 left-0 h-8 w-8 bg-[#c55527]" />

                        <div className="absolute top-2 right-4 grid grid-cols-4 gap-2 opacity-35">
                            {Array.from({ length: 12 }).map((_, index) => (
                                <span
                                    key={index}
                                    className="h-1.5 w-1.5 rounded-full bg-white/60"
                                />
                            ))}
                        </div>

                        <div className="relative z-10">
                            <h4 className="text-center text-[clamp(1.95rem,2.5vw,2.5rem)] font-extrabold text-[#b6ff44]">
                                Jam Operasional
                            </h4>

                            <div className="mt-10 space-y-7 text-[1.06rem] sm:text-[1.15rem]">
                                <div className="flex justify-between">
                                    <span className="font-extrabold">
                                        Senin - Jumat
                                    </span>
                                    <span>09:00 - 18:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-extrabold">
                                        Sabtu
                                    </span>
                                    <span>10:00 - 15:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-extrabold">
                                        Minggu
                                    </span>
                                    <span className="font-extrabold text-[#ff6b9a]">
                                        Tutup
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-16 w-full md:mt-20 md:p-4">
                <div className="mb-8 text-center md:mb-12">
                    <h4 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
                        Akses Transportasi
                    </h4>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 md:text-lg">
                        Lokasi kantor mudah dijangkau dengan transportasi umum
                        maupun kendaraan pribadi.
                    </p>
                </div>

                <div className="relative flex w-full flex-col gap-4 p-5 md:flex-row md:gap-0">
                    {/* Line horizontal desktop — dari center icon pertama ke center icon terakhir */}
                    <div className="absolute top-[60px] right-0 left-0 hidden px-[calc(100%/6)] md:block">
                        <div className="h-px w-full bg-gray-200" />
                    </div>

                    {/* Line vertikal mobile — dari icon pertama ke icon terakhir */}
                    <div className="absolute top-[42px] bottom-[80px] left-[60px] w-px bg-gray-200 md:hidden" />

                    {transportList.map((item) => (
                        <div
                            key={item.id}
                            className="relative z-10 flex flex-1 flex-row items-start gap-6 p-4 md:flex-col md:items-center"
                        >
                            <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-4 border-white ${item.iconBg} ${item.iconColor}`}
                            >
                                <Icon {...item.icon} size={22} />
                            </div>

                            <div className="flex w-full flex-1 flex-col gap-1 border-b border-gray-100 pb-8 md:items-center md:border-none md:pb-0">
                                <span className="text-base font-medium text-gray-800 md:text-lg">
                                    {item.title}
                                </span>
                                <span
                                    className={`text-base font-bold md:text-lg ${item.distanceColor}`}
                                >
                                    {item.distance}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
