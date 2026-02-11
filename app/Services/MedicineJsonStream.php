<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class MedicineJsonStream
{
    public static function stream(): \Generator
    {
        $handle = fopen(Storage::disk('public')->path('medicines.json'), 'r');

        if (! $handle) {
            throw new \Exception('Cannot open medicines.json');
        }

        $buffer = '';
        while (! feof($handle)) {
            $buffer .= fgets($handle);

            while (($pos = strpos($buffer, '},')) !== false) {
                $chunk = substr($buffer, 0, $pos + 1);
                $buffer = substr($buffer, $pos + 2);

                $item = json_decode(trim($chunk, ",[]\n"), true);
                if ($item) {
                    yield $item;
                }
            }
        }

        fclose($handle);
    }
}
