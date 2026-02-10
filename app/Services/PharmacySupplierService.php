<?php

namespace App\Services;

use App\Models\PharmacySupplier;
use App\Repositories\PharmacySupplierRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class PharmacySupplierService
{
    protected $pharmacySupplierRepository;

    public function __construct(PharmacySupplierRepository $pharmacySupplierRepository)
    {
        $this->pharmacySupplierRepository = $pharmacySupplierRepository;
    }

    public function getPharmacySuppliers(int $pharmacyId, array $columns): LengthAwarePaginator
    {
        return $this->pharmacySupplierRepository->getPharmacySuppliers($pharmacyId, $columns);
    }

    public function createPharmacySupplier(array $data): PharmacySupplier
    {
        $data['supplier_name'] = trim($data['supplier_name'] ?? '', ' ');
        $data['company_name'] = isset($data['company_name']) ? trim($data['company_name'], ' ') : null;
        $data['contact'] = isset($data['contact']) ? trim($data['contact'], ' ') : null;
        $data['address'] = isset($data['address']) ? trim($data['address'], ' ') : null;

        return $this->pharmacySupplierRepository->create($data);
    }

    public function getPharmacySupplierById(int $id, array $columns = ['*']): ?PharmacySupplier
    {
        return $this->pharmacySupplierRepository->getById($id, $columns);
    }

    public function updatePharmacySupplier(PharmacySupplier $pharmacySupplier, array $data): PharmacySupplier
    {
        if (isset($data['supplier_name'])) {
            $data['supplier_name'] = trim($data['supplier_name'], ' ');
        }
        if (isset($data['company_name'])) {
            $data['company_name'] = trim($data['company_name'], ' ');
        }
        if (isset($data['contact'])) {
            $data['contact'] = trim($data['contact'], ' ');
        }
        if (isset($data['address'])) {
            $data['address'] = trim($data['address'], ' ');
        }

        return $this->pharmacySupplierRepository->update($pharmacySupplier, $data);
    }

    public function deletePharmacySupplier(PharmacySupplier $pharmacySupplier): bool
    {
        return $this->pharmacySupplierRepository->delete($pharmacySupplier);
    }

    /**
     * Copy data from global supplier to pharmacy supplier
     */
    public function copyFromGlobalSupplier(int $pharmacyId, int $globalSupplierId): PharmacySupplier
    {
        $globalSupplier = \App\Models\Supplier::findOrFail($globalSupplierId);

        $data = [
            'pharmacy_id' => $pharmacyId,
            'supplier_name' => $globalSupplier->name,
            'company_name' => $globalSupplier->company_name,
            'contact' => $globalSupplier->phone,
            'address' => $globalSupplier->address,
        ];

        return $this->createPharmacySupplier($data);
    }
}
