<?php

namespace App\Http\Controllers\Categories;

use App\Http\Controllers\Controller;
use App\Services\CategoryService;
use Inertia\Inertia;

class CategoryController extends Controller
{
    protected $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index()
    {
        $categories = $this->categoryService->categories(
            columns: ['id', 'name', 'is_active'],
        );

        return Inertia::render('categories/categories', ['categories' => $categories]);
    }
}
