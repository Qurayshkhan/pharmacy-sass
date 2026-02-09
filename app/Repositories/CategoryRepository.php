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

    public function create($data)
    {
        return Category::create($data);
    }
}
