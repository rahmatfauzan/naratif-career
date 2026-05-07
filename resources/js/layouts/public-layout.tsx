import { usePage } from '@inertiajs/react';
import Navbar from '@/components/navbar';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { component } = usePage();
    const pageName = component.toLowerCase();

    let navMode: 'transparent' | 'solid';
    if (pageName === 'public/jobdetail') {
        navMode = 'solid';
    } else {
        navMode = 'transparent';
    }

    return (
        <>
            <Navbar mode={navMode} />
            {children}
        </>
    );
}
