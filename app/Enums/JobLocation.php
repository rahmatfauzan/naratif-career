<?php

namespace App\Enums;

enum JobLocation: string
{
    case Onsite = 'onsite';
    case Remote = 'remote';
    case Hybrid = 'hybrid';

    public static function options(): array
    {
        return collect(self::cases())->map(fn($location) => [
            'label' => match ($location) {
                self::Onsite => 'Onsite',
                self::Remote => 'Remote',
                self::Hybrid => 'Hybrid',
            },
            'value' => $location->value,
        ])->toArray();
    }
}
