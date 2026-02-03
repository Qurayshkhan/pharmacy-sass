<?php

namespace App\Providers;

use App\Interface\PharmacyInterface;
use App\Interface\UserInterface;
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
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}