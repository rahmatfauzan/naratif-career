import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import HeroSection from './components/HeroSection';
import AboutUsSection from './components/AboutUsSection';
import LocationSection from './components/LocationSection';
import CultureSection from './components/CultureSection';
import FaqSection from './components/FaqSection';
import FooterSection from './components/FooterSection';
import Navbar from '@/components/navbar';
import JobSection from './components/JobSection';

export default function PageLayout({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Welcome" />
            <HeroSection />
            <AboutUsSection />
            <LocationSection />
            <CultureSection />
            <JobSection />
            <FaqSection />
            <FooterSection />
        </>
    );
}
