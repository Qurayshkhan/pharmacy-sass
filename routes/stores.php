<?php

use App\Http\Controllers\Stores\StoreController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'stores'], function () {
    Route::get('/{uuid}', [StoreController::class, 'edit'])->name('stores.edit');
    Route::post('/store', [StoreController::class, 'store'])->name('stores.store');
    Route::put('/update', [StoreController::class, 'update'])->name('stores.update');
});

Route::group(['prefix' => 'stores', 'middleware' => ['auth']], function () {
    Route::get('/store/create', [StoreController::class, 'create'])->name('stores.storeCreate');
    Route::get('/', [StoreController::class, 'index'])->name('stores.index');
    Route::get('/{uuid}/edit', [StoreController::class, 'adminEdit'])->name('stores.adminEdit');
    Route::delete('/{uuid}/delete', [StoreController::class, 'destroy'])->name('stores.pharmacyDestroy');
});
