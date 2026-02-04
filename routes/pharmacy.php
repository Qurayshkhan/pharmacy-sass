<?php

use App\Http\Controllers\Pharmacy\PharmacyController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::post('/pharmacies/store', [PharmacyController::class, 'store']);
Route::group(['prefix' => 'pharmacies', 'middleware' => ['auth']], function () {
    Route::get('/', [PharmacyController::class, 'index'])->name('pharmacies.index');

});
