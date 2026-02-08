<?php

namespace App\Services;

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

    public function getPharmacies($columns)
    {

        return $this->pharmacyRepository->getPharmacies($columns);
    }

    public function getPharmacyByUserId(int $userId): ?Pharmacy
    {
        return $this->pharmacyRepository->getPharmacyByUserId($userId);
    }

    public function getPharmacyByUuid(string $uuid): ?Pharmacy
    {
        return $this->pharmacyRepository->getPharmacyByUuid($uuid);
    }

    public function updatePharmacy($pharmacy, array $data): bool
    {
        $data = [
            'license_number' => $data['license_number'],
            'branch' => $data['branch'],
            'address' => $data['address'],
            'contact' => $data['contact'],
            'is_registered' => true,
            'uuid' => $pharmacy->uuid,
        ];

        return $this->pharmacyRepository->updatePharmacy($data);
    }
}
