<?php

namespace App\Repositories;

use App\Interfaces\MedicineInterface;
use App\Models\Medicine;
use Illuminate\Contracts\Pagination\CursorPaginator;

class MedicineRepository implements MedicineInterface
{
    public function getAllMedicines($request): CursorPaginator
    {
        $query = Medicine::query()
            ->select('id', 'name', 'company', 'pack_size', 'sale_price', 'mrp');
        $search = trim($request->input('search', ''));
        if (! empty($search)) {
            if (strlen($search) <= 3) {
                $query->where('name', 'LIKE', "%{$search}%");
            } else {
                $query->whereFullText(['name', 'company'], $search, ['mood' => 'boolean']);
            }
        }

        return $query
            ->orderBy('name')
            ->cursorPaginate(10)
            ->withQueryString();
    }
}
