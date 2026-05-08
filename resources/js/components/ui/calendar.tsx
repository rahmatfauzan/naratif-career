// @/components/ui/calendar.tsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export type CalendarProps = {
    selected?: Date;
    onSelect?: (date: Date) => void;
    className?: string;
    yearRange?: { from: number; to: number };
    disabled?: (date: Date) => boolean;
};

export function Calendar({ selected, onSelect, className, yearRange, disabled }: CalendarProps) {
    const today = new Date();
    const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear());
    const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());

    const fromYear = yearRange?.from ?? today.getFullYear() - 50;
    const toYear = yearRange?.to ?? today.getFullYear() + 50;

    const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;

    function prevMonth() {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    }
    function nextMonth() {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    }

    return (
        <div className={cn('p-3 w-fit select-none', className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <button
                    type="button"
                    onClick={prevMonth}
                    className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex gap-1">
                    <select
                        value={viewMonth}
                        onChange={e => setViewMonth(Number(e.target.value))}
                        className="text-sm font-medium bg-accent/50 hover:bg-accent rounded-md px-2 py-1 cursor-pointer outline-none"
                    >
                        {MONTHS.map((m, i) => (
                            <option key={m} value={i}>{m}</option>
                        ))}
                    </select>
                    <select
                        value={viewYear}
                        onChange={e => setViewYear(Number(e.target.value))}
                        className="text-sm font-medium bg-accent/50 hover:bg-accent rounded-md px-2 py-1 cursor-pointer outline-none"
                    >
                        {Array.from({ length: toYear - fromYear + 1 }, (_, i) => fromYear + i).map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="button"
                    onClick={nextMonth}
                    className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

            {/* Weekday labels */}
            <div className="grid grid-cols-7 mb-1">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
                    <div key={d} className="text-center text-[0.7rem] text-muted-foreground font-medium py-1 uppercase tracking-wide">
                        {d}
                    </div>
                ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-y-1">
                {/* Prev month days */}
                {Array.from({ length: firstDayOfMonth }, (_, i) => (
                    <button type="button" key={`prev-${i}`}
                        className="h-9 w-9 text-sm text-muted-foreground opacity-40 cursor-default mx-auto flex items-center justify-center"
                    >
                        {prevMonthDays - firstDayOfMonth + 1 + i}
                    </button>
                ))}

                {/* Current month days */}
                {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const thisDate = new Date(viewYear, viewMonth, day);
                    const isToday =
                        today.getFullYear() === viewYear &&
                        today.getMonth() === viewMonth &&
                        today.getDate() === day;
                    const isSelected =
                        selected &&
                        selected.getFullYear() === viewYear &&
                        selected.getMonth() === viewMonth &&
                        selected.getDate() === day;
                    const isDisabled = disabled?.(thisDate) ?? false;

                    return (
                        <button
                            type="button"
                            key={day}
                            onClick={() => !isDisabled && onSelect?.(thisDate)}
                            disabled={isDisabled}
                            className={cn(
                                'h-9 w-9 rounded-full text-sm transition-colors mx-auto flex items-center justify-center',
                                isSelected
                                    ? 'bg-blue-600 text-white font-semibold'
                                    : isToday
                                    ? 'bg-slate-100 text-slate-900 font-bold'
                                    : isDisabled
                                    ? 'text-muted-foreground opacity-40 cursor-not-allowed'
                                    : 'hover:bg-accent',
                            )}
                        >
                            {day}
                        </button>
                    );
                })}

                {/* Next month days */}
                {Array.from({ length: totalCells - firstDayOfMonth - daysInMonth }, (_, i) => (
                    <button type="button" key={`next-${i}`}
                        className="h-9 w-9 text-sm text-muted-foreground opacity-40 cursor-default mx-auto flex items-center justify-center"
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

Calendar.displayName = 'Calendar';