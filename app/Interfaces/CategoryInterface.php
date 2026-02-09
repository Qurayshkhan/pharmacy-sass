<?php

namespace App\Interfaces;

use Illuminate\Pagination\LengthAwarePaginator;

interface CategoryInterface
{
    public function categories(array $columns): LengthAwarePaginator;

    public function create(array $data);
}
