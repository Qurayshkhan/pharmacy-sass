<?php

namespace App\Providers;

use App\Interfaces\CategoryInterface;
use App\Interfaces\ItemInterface;
use App\Interfaces\MedicineInterface;
use App\Interfaces\MySupplierInterface;
use App\Interfaces\SupplierInterface;
use App\Interfaces\UserInterface;
use App\Repositories\CategoryRepository;
use App\Repositories\ItemRepository;
use App\Repositories\MedicineRepository;
use App\Repositories\MySupplierRepository;
use App\Repositories\SupplierRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(UserInterface::class, UserInterface::class);
        $this->app->bind(CategoryInterface::class, CategoryRepository::class);
        $this->app->bind(SupplierInterface::class, SupplierRepository::class);
        $this->app->bind(MySupplierInterface::class, MySupplierRepository::class);
        $this->app->bind(MedicineInterface::class, MedicineRepository::class);
        $this->app->bind(ItemInterface::class, ItemRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
