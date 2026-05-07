import * as React from 'react';
import { cn } from '@/lib/utils';

type IconProps = {
    path?: string;
    paths?: string[];
    size?: number | string;
    className?: string;
} & React.ComponentProps<'svg'>;

export default function Icon({
    path,
    paths = [],
    size = 24, // Default size 24
    className,
    ...props
}: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24" // <-- Langsung hardcode di sini
            className={cn('', className)}
            {...props}
            width={size} // width & height tetap di bawah
            height={size} // agar tidak tertimpa oleh ...props
        >
            {path && <path d={path} />}
            {paths.map((p, i) => (
                <path key={i} d={p} />
            ))}
        </svg>
    );
}
