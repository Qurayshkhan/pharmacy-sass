<?php

namespace App\Interfaces;

use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Http\Request;

interface MedicineInterface
{
    public function getAllMedicines(Request $request): CursorPaginator;
}
