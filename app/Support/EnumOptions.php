<?php

namespace App\Support;

use BackedEnum;
use Illuminate\Support\Str;

class EnumOptions
{
    /**
     * @param  class-string<BackedEnum>  $enumClass
     * @return list<array{value: string, label: string}>
     */
    public static function from(string $enumClass): array
    {
        return array_map(
            static fn (BackedEnum $case): array => [
                'value' => (string) $case->value,
                'label' => method_exists($case, 'label') ? (string) $case->label() : Str::headline((string) $case->value),
            ],
            $enumClass::cases(),
        );
    }
}
