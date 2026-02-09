<?php

namespace App\Services;

use App\Models\Category;
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

    public function createCategory(array $data): Category
    {
        $data['name'] = trim($data['name'] ?? '', ' ');
        $data['description'] = isset($data['description']) ? trim($data['description'], ' ') : null;
        $data['is_active'] = $data['is_active'] ?? true;

        return $this->categoryRepository->create($data);
    }

    public function getCategoryById(int $id, array $columns = ['*']): ?Category
    {
        return $this->categoryRepository->getById($id, $columns);
    }

    public function updateCategory(Category $category, array $data): Category
    {
        if (isset($data['name'])) {
            $data['name'] = trim($data['name'], ' ');
        }
        if (isset($data['description'])) {
            $data['description'] = trim($data['description'], ' ');
        }

        return $this->categoryRepository->update($category, $data);
    }

    public function deleteCategory(Category $category): bool
    {
        return $this->categoryRepository->delete($category);
    }
}
