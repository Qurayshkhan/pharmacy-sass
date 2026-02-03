<?php

namespace App\Service;

use App\Repositories\PharmacyRepository;

class PharmacyService
{
    protected $pharmacyRepository;
    public function __construct(PharmacyRepository $pharmacyRepository)
    {
        $this->pharmacyRepository = $pharmacyRepository;
    }
}