<?php

namespace App\Providers;

use App\Interfaces\CategoryInterface;
use App\Interfaces\PharmacyInterface;
use App\Interfaces\UserInterface;
use App\Repositories\CategoryRepository;
use App\Repositories\PharmacyRepository;
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
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
