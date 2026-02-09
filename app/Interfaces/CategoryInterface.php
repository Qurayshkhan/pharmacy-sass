<?php

namespace App\Interfaces;

use App\Models\Category;
use Illuminate\Pagination\LengthAwarePaginator;

interface CategoryInterface
{
    public function categories(array $columns): LengthAwarePaginator;

    public function create(array $data): Category;

    public function getById(int $id, array $columns = ['*']): ?Category;

    public function update(Category $category, array $data): Category;

    public function delete(Category $category): bool;
}
