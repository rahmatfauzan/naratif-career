<?php

namespace App\Enums;

enum JobType: string
{
    case FullTime = 'full-time';
    case PartTime = 'part-time';
    case Contract = 'contract';
    case Internship = 'internship';
    case Freelance = 'freelance';

    public static function options(): array
    {
        return collect(self::cases())->map(fn($type) => [
            'label' => match ($type) {
                self::FullTime => 'Full-time',
                self::PartTime => 'Part-time',
                self::Contract => 'Contract',
                self::Internship => 'Internship',
                self::Freelance => 'Freelance',
            },
            'value' => $type->value,
        ])->toArray();
    }
}
