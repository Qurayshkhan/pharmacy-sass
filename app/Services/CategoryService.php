<?php

namespace App\Services;

use App\Repositories\CategoryRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class CategoryService
{
    protected $categoryRepository;

    public function __construct(CategoryRepository $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    public function categories(array $columns): LengthAwarePaginator
    {
        return $this->categoryRepository->categories($columns);
    }

    public function createCategory(array $data)
    {
        $data['name'] = trim($data['name'], ' ');
        $data['description'] = trim($data['description'], ' ');

        return $this->categoryRepository->create($data);
    }
}
