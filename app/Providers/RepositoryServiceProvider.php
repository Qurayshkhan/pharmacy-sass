<?php

namespace App\Providers;

use App\Interfaces\CategoryInterface;
use App\Interfaces\MedicineInterface;
use App\Interfaces\PharmacyInterface;
use App\Interfaces\PharmacySupplierInterface;
use App\Interfaces\SupplierInterface;
use App\Interfaces\UserInterface;
use App\Repositories\CategoryRepository;
use App\Repositories\MedicineRepository;
use App\Repositories\PharmacyRepository;
use App\Repositories\PharmacySupplierRepository;
use App\Repositories\SupplierRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(PharmacyInterface::class, PharmacyRepository::class);
        $this->app->bind(UserInterface::class, UserInterface::class);
        $this->app->bind(CategoryInterface::class, CategoryRepository::class);
        $this->app->bind(SupplierInterface::class, SupplierRepository::class);
        $this->app->bind(PharmacySupplierInterface::class, PharmacySupplierRepository::class);
        $this->app->bind(MedicineInterface::class, MedicineRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
