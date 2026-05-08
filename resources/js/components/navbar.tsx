import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LogoIcon from './icon/LogoIcon';
import { Button } from './ui/button';
import { Link, usePage } from '@inertiajs/react';
import { Auth } from '@/types/auth';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

type NavbarProps = {
    mode?: 'transparent' | 'solid';
};

export default function Navbar({ mode = 'transparent' }: NavbarProps) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

    const isSolid = mode === 'solid';
    const textColor = isSolid ? 'text-gray-900' : 'text-white';

    const scrolledBg = isSolid
        ? 'bg-white/80 backdrop-blur-md border-b'
        : 'bg-black/80 backdrop-blur-md';

    const navbarBg = isSolid
        ? scrolledBg
        : isScrolled
          ? scrolledBg
          : 'bg-transparent';

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Kunci scroll body saat menu terbuka
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const menuList = [
        { name: 'Home', href: '/' },
        { name: 'Tentang Kami', href: '/tentang-kami' },
        { name: 'Tim Kami', href: '/tim-kami' },
        { name: 'Budaya', href: '/budaya' },
        { name: 'Karir', href: '/job' },
    ];

    const menuVariants = {
        hidden: { opacity: 0, y: -16, scale: 0.98 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.25,
                ease: smoothEase,
                staggerChildren: 0.06,
            },
        },
        exit: {
            opacity: 0,
            y: -16,
            scale: 0.98,
            transition: { duration: 0.18, ease: 'easeIn' as const },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -12 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.22, ease: smoothEase },
        },
        exit: { opacity: 0, x: -12 },
    };

    const topBar = {
        closed: { rotate: 0, y: 0 },
        open: { rotate: 45, y: 8 },
    };
    const midBar = {
        closed: { opacity: 1, scaleX: 1 },
        open: { opacity: 0, scaleX: 0 },
    };
    const botBar = {
        closed: { rotate: 0, y: 0 },
        open: { rotate: -45, y: -8 },
    };

    return (
        <>
            <nav
                className={`fixed top-0 right-0 left-0 z-50 w-full transition-all duration-300 ${navbarBg} ${textColor} ${
                    isScrolled || isSolid ? 'py-4 shadow-lg' : 'py-6'
                }`}
            >
                <div className="container mx-auto px-6 md:px-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-10">
                            <div className="flex items-center gap-2">
                                <LogoIcon />
                                <span className="text-[40px] font-semibold">
                                    naratif
                                </span>
                            </div>

                            <div className="hidden gap-9 md:flex">
                                {menuList.map((menu) => (
                                    <Link
                                        key={menu.href}
                                        href={menu.href}
                                        className="transition-colors hover:opacity-70"
                                    >
                                        {menu.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="hidden items-center gap-2 md:flex">
                            {auth?.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-3 hover:opacity-80">
                                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white/10">
                                            {auth.user.avatar ? (
                                                <img
                                                    src={`storage/${auth.user.avatar}`}
                                                    alt={auth.user.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-sm font-semibold uppercase">
                                                    {auth.user.name.charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                        <span>{auth.user.name}</span>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        sideOffset={8}
                                        className="w-56"
                                    >
                                        <DropdownMenuLabel>
                                            Akun Saya
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard">
                                                <User className="mr-2 h-4 w-4" />
                                                Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile">
                                                <Settings className="mr-2 h-4 w-4" />
                                                Pengaturan Profil
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            asChild
                                            className="text-red-600"
                                        >
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Keluar
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <>
                                    <Button
                                        className={cn(
                                            'transition-colors',
                                            mode === 'transparent' &&
                                                'bg-transparent hover:bg-white/10',
                                        )}
                                        asChild
                                    >
                                        <Link href="/login">Login</Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className={
                                            isSolid
                                                ? 'border-gray-900 bg-gray-900 text-white hover:bg-gray-700'
                                                : 'border-white bg-white text-black hover:bg-gray-200'
                                        }
                                        asChild
                                    >
                                        <Link href="/register">Sign Up</Link>
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Hamburger button */}
                        <motion.button
                            className="flex flex-col gap-1.5 md:hidden"
                            onClick={() => setIsOpen(!isOpen)}
                            animate={isOpen ? 'open' : 'closed'}
                            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
                        >
                            <motion.span
                                variants={topBar}
                                transition={{ duration: 0.2 }}
                                className="block h-0.5 w-8 origin-center bg-current"
                            />
                            <motion.span
                                variants={midBar}
                                transition={{ duration: 0.15 }}
                                className="block h-0.5 w-8 bg-current"
                            />
                            <motion.span
                                variants={botBar}
                                transition={{ duration: 0.2 }}
                                className="block h-0.5 w-8 origin-center bg-current"
                            />
                        </motion.button>
                    </div>
                </div>
            </nav>

            {/* Mobile fullscreen overlay — di luar <nav> */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Panel menu */}
                        <motion.div
                            key="menu"
                            variants={menuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="fixed inset-x-0 top-0 z-40 flex min-h-screen flex-col bg-neutral-950 px-6 pt-28 pb-12 md:hidden"
                        >
                            {/* Nav links */}
                            <div className="flex flex-col gap-1">
                                {menuList.map((menu) => (
                                    <motion.div
                                        key={menu.href}
                                        variants={itemVariants}
                                    >
                                        <Link
                                            href={menu.href}
                                            onClick={() => setIsOpen(false)}
                                            className="block rounded-xl px-4 py-4 text-xl font-medium text-white transition-colors hover:bg-white/10"
                                        >
                                            {menu.name}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Divider */}
                            <motion.div
                                variants={itemVariants}
                                className="my-6 border-t border-white/10"
                            />

                            {/* Auth section */}
                            <motion.div variants={itemVariants}>
                                {auth?.user ? (
                                    <div className="flex flex-col gap-1">
                                        <Link
                                            href="/dashboard"
                                            className="block rounded-xl px-4 py-4 text-white transition-colors hover:bg-white/10"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/profile"
                                            className="block rounded-xl px-4 py-4 text-white transition-colors hover:bg-white/10"
                                        >
                                            Profil
                                        </Link>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="block rounded-xl px-4 py-4 text-left text-red-400 transition-colors hover:bg-white/10"
                                        >
                                            Keluar
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <Link
                                            href="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="block rounded-xl border border-white/20 py-3 text-center text-white transition-colors hover:bg-white/10"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setIsOpen(false)}
                                            className="block rounded-xl bg-white py-3 text-center font-medium text-black transition-colors hover:bg-gray-200"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
