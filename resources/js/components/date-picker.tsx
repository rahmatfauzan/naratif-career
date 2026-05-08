import * as React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

export interface DatePickerProps {
    date?: Date | null;
    setDate: (date: Date | null) => void;
    disabled?: (date: Date) => boolean;
    placeholder?: string;
    className?: string;
    isDisabled?: boolean;
}

export function DatePicker({
    date,
    setDate,
    disabled,
    placeholder = 'Pilih tanggal',
    className,
    isDisabled = false,
}: DatePickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant={'outline'}
                    disabled={isDisabled}
                    className={cn(
                        'h-11 w-full justify-start border-slate-200 text-left font-normal focus:border-blue-500 focus:ring-blue-500',
                        !date && 'text-muted-foreground',
                        isDisabled && 'bg-slate-50 text-slate-400 opacity-100',
                        className,
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                    {date && !isDisabled ? (
                        format(date, 'PPP', { locale: id })
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    selected={date ? date : undefined}
                    onSelect={(d) => {
                        setDate(d);
                        // We could close popover here if we want, but we don't have popover state
                    }}
                    disabled={disabled}
                />
            </PopoverContent>
        </Popover>
    );
}
