<?php

namespace App\Http\Controllers\Categories;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryStoreRequest;
use App\Http\Requests\CategoryUpdateRequest;
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
        return Inertia::render('categories/categories', [
            'categories' => Inertia::defer(function () {
                return $this->categoryService->categories(['id', 'name', 'description', 'is_active']);
            }),
        ]);
    }

    public function store(CategoryStoreRequest $request)
    {
        try {
            DB::beginTransaction();
            $category = $this->categoryService->createCategory($request->validated());

            DB::commit();

            return Redirect::back()->with('success', "Category {$category->name} created successfully.");
        } catch (\Exception $e) {
            DB::rollBack();

            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function edit($id)
    {
        $category = $this->categoryService->getCategoryById($id, ['id', 'name', 'description', 'is_active']);

        if (! $category) {
            abort(404);
        }

        return Inertia::render('categories/categories', [
            'categories' => Inertia::defer(function () {
                return $this->categoryService->categories(['id', 'name', 'description', 'is_active']);
            }),
            'category' => $category,
        ]);
    }

    public function update(CategoryUpdateRequest $request, $id)
    {
        try {
            DB::beginTransaction();

            $category = $this->categoryService->getCategoryById($id);
            if (! $category) {
                return Redirect::back()->with('error', 'Category not found.');
            }

            $this->categoryService->updateCategory($category, $request->validated());

            DB::commit();

            return Redirect::back()->with('success', "Category {$category->name} updated successfully.");
        } catch (\Exception $e) {
            DB::rollBack();

            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $category = $this->categoryService->getCategoryById($id);
            if (! $category) {
                return Redirect::back()->with('error', 'Category not found.');
            }

            $categoryName = $category->name;
            $this->categoryService->deleteCategory($category);

            return Redirect::back()->with('success', "Category {$categoryName} deleted successfully.");
        } catch (\Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }
}
