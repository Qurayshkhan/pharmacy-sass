<?php

use App\Http\Controllers\Pharmacy\PharmacyController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'pharmacies'], function () {
    Route::get('/{uuid}', [PharmacyController::class, 'edit'])->name('pharmacies.edit');
    Route::post('/store', [PharmacyController::class, 'store'])->name('pharmacies.store');
    Route::put('/update', [PharmacyController::class, 'update'])->name('pharmacies.update');

});
Route::group(['prefix' => 'pharmacies', 'middleware' => ['auth']], function () {
    Route::get('/', [PharmacyController::class, 'index'])->name('pharmacies.index');
    // Route::put('/update/{uuid}', [PharmacyController::class, 'update'])->name('pharmacies.adminUpdate');
});
