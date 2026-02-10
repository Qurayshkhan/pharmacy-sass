<?php

namespace App\Services;

use App\Models\Supplier;
use App\Repositories\SupplierRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class SupplierService
{
    protected $supplierRepository;

    public function __construct(SupplierRepository $supplierRepository)
    {
        $this->supplierRepository = $supplierRepository;
    }

    public function getSuppliers(array $columns): LengthAwarePaginator
    {
        return $this->supplierRepository->getSuppliers($columns);
    }

    public function createSupplier(array $data): Supplier
    {
        $data['name'] = trim($data['name'] ?? '', ' ');
        $data['company_name'] = isset($data['company_name']) ? trim($data['company_name'], ' ') : null;
        $data['phone'] = isset($data['phone']) ? trim($data['phone'], ' ') : null;
        $data['address'] = isset($data['address']) ? trim($data['address'], ' ') : null;

        return $this->supplierRepository->create($data);
    }

    public function getSupplierById(int $id, array $columns = ['*']): ?Supplier
    {
        return $this->supplierRepository->getById($id, $columns);
    }

    public function updateSupplier(Supplier $supplier, array $data): Supplier
    {
        if (isset($data['name'])) {
            $data['name'] = trim($data['name'], ' ');
        }
        if (isset($data['company_name'])) {
            $data['company_name'] = trim($data['company_name'], ' ');
        }
        if (isset($data['phone'])) {
            $data['phone'] = trim($data['phone'], ' ');
        }
        if (isset($data['address'])) {
            $data['address'] = trim($data['address'], ' ');
        }

        return $this->supplierRepository->update($supplier, $data);
    }

    public function deleteSupplier(Supplier $supplier): bool
    {
        return $this->supplierRepository->delete($supplier);
    }

    /**
     * Get all suppliers for dropdown/select (used by pharmacies to copy from global)
     */
    public function getAllSuppliersForSelect(): array
    {
        return Supplier::select('id', 'name', 'company_name', 'phone', 'address')
            ->orderBy('name')
            ->get()
            ->toArray();
    }
}
