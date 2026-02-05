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

    public function createPharmacy(array $data): Pharmacy
    {
        return $this->pharmacyRepository->create($data);
    }

    public function getPharmacyByUserId(int $userId): ?Pharmacy
    {
        return $this->pharmacyRepository->getPharmacyByUserId($userId);
    }

    public function getPharmacyByUuid(string $uuid): ?Pharmacy
    {
        return $this->pharmacyRepository->getPharmacyByUuid($uuid);
    }

    public function updatePharmacy(array $data): bool
    {
        $data = [
            'license_number' => $data['license_number'],
            'branch' => $data['branch'],
            'address' => $data['address'],
            'contact' => $data['contact'],
        ];

        return $this->pharmacyRepository->updatePharmacy($data);
    }
}
