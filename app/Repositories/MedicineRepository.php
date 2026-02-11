<?php

namespace App\Repositories;

use App\Interfaces\MedicineInterface;
use App\Models\Medicine;
use Illuminate\Pagination\Paginator;

class MedicineRepository implements MedicineInterface
{
    public function getAllMedicines($request): Paginator
    {
        $query = Medicine::query()
            ->select('id', 'name', 'company', 'pack_size', 'sale_price', 'mrp');

        $query->when($request->search, function ($query, $search) {
            // $query->whereAny([
            //     'name',
            //     'company',
            // ], 'LIKE', '%'.$search.'%');
            $query->whereFullText(['name', 'company'], $search);
        });

        return $query
            ->orderBy('name')
            ->simplePaginate(10)
            ->withQueryString();
    }
}
