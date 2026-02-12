<?php

use App\Http\Controllers\Categories\CategoryController;
use App\Http\Controllers\Medicines\MedicineController;
use App\Http\Controllers\MySuppliers\MySupplierController;
use App\Http\Controllers\Suppliers\SupplierController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::group(['prefix' => 'categories', 'middleware' => 'auth'], function () {
    Route::get('/', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('/store', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('/{id}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
    Route::put('/{id}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/{id}', [CategoryController::class, 'destroy'])->name('categories.destroy');
});

// Global Suppliers (Admin Only)
Route::group(['prefix' => 'suppliers', 'middleware' => 'auth'], function () {
    Route::get('/', [SupplierController::class, 'index'])->name('suppliers.index');
    Route::post('/store', [SupplierController::class, 'store'])->name('suppliers.store');
    Route::get('/{id}/edit', [SupplierController::class, 'edit'])->name('suppliers.edit');
    Route::put('/{id}', [SupplierController::class, 'update'])->name('suppliers.update');
    Route::delete('/{id}', [SupplierController::class, 'destroy'])->name('suppliers.destroy');
    Route::get('/all/select', [SupplierController::class, 'getAllForSelect'])->name('suppliers.getAllForSelect');
});

// My Suppliers
Route::group(['prefix' => 'my-suppliers', 'middleware' => 'auth'], function () {
    Route::get('/', [MySupplierController::class, 'index'])->name('my-suppliers.index');
    Route::post('/store', [MySupplierController::class, 'store'])->name('my-suppliers.store');
    Route::post('/copy-from-global', [MySupplierController::class, 'copyFromGlobal'])->name('my-suppliers.copyFromGlobal');
    Route::get('/{id}/edit', [MySupplierController::class, 'edit'])->name('my-suppliers.edit');
    Route::put('/{id}', [MySupplierController::class, 'update'])->name('my-suppliers.update');
    Route::delete('/{id}', [MySupplierController::class, 'destroy'])->name('my-suppliers.destroy');
});

Route::group(['prefix' => 'medicines', 'middleware' => ['auth']], function () {
    Route::get('/', [MedicineController::class, 'index'])->name('medicines.index');
    Route::get('/search', [MedicineController::class, 'search'])->name('medicines.search');
});

require __DIR__.'/stores.php';
require __DIR__.'/pharmacy.php';
require __DIR__.'/settings.php';
