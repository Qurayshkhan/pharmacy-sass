<?php

namespace App\Http\Controllers\Categories;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryStoreRequest;
use App\Services\CategoryService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
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

    public function store(CategoryStoreRequest $request)
    {
        try {
            DB::beginTransaction();
            $category = $this->categoryService->createCategory($request->all());

            DB::commit();

            return Redirect::back()->with('success', "Category {$category->name} store successfully.");
        } catch (\Exception $e) {
            DB::rollBack();

            return Redirect::back()->with('error', $e->getMessage());
        }
    }
}
