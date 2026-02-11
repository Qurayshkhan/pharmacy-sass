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

        // Get and sanitize search term
        $search = trim($request->input('search', ''));

        // Apply search filter if search term exists
        if (! empty($search)) {
            $searchTerm = '%'.$search.'%';

            // Search in both name and company fields using OR condition
            // Both fields have indexes (idx_name, idx_company) for optimized queries
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', $searchTerm)
                    ->orWhere('company', 'LIKE', $searchTerm);
            });
        }

        return $query
            ->orderBy('name')
            ->cursorPaginate(10)
            ->withQueryString();
    }
}
