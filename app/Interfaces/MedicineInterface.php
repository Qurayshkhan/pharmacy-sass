<?php

namespace App\Interfaces;

use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;

interface MedicineInterface
{
    public function getAllMedicines(Request $request): Paginator;
}
