<?php

namespace App\Services;

use App\Repositories\StoreRepository;

class StoreService
{
    public $storeRepository;

    public function __construct(StoreRepository $storeRepository)
    {
        $this->storeRepository = $storeRepository;
    }

    public function getStores()
    {
        return $this->storeRepository->getStores();
    }
}
