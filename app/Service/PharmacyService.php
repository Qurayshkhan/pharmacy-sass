<?php

namespace App\Service;

use App\Models\Pharmacy;
use App\Repositories\PharmacyRepository;

class PharmacyService
{
    protected $pharmacyRepository;
    public function __construct(PharmacyRepository $pharmacyRepository)
    {
        $this->pharmacyRepository = $pharmacyRepository;
    }

    public function createPharmacy(array $data): Pharmacy{
        return $this->pharmacyRepository->create($data);
    }
}
