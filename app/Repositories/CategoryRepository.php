<?php

namespace App\Repositories;

use App\Interfaces\CategoryInterface;
use App\Models\Category;
use Illuminate\Pagination\LengthAwarePaginator;

class CategoryRepository implements CategoryInterface
{
    public function categories(array $columns): LengthAwarePaginator
    {
        return Category::select($columns)->paginate(25);
    }

    public function create(array $data): Category
    {
        return Category::create($data);
    }

    public function getById(int $id, array $columns = ['*']): ?Category
    {
        return Category::select($columns)->find($id);
    }

    public function update(Category $category, array $data): Category
    {
        $category->update($data);

        return $category->fresh();
    }

    public function delete(Category $category): bool
    {
        return $category->delete();
    }
}
