<?php

namespace App\Services;

use App\Models\MySupplier;
use App\Repositories\MySupplierRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class MySupplierService
{
    protected $mySupplierRepository;

    public function __construct(MySupplierRepository $mySupplierRepository)
    {
        $this->mySupplierRepository = $mySupplierRepository;
    }

    public function getMySuppliers(int $userId, array $columns): LengthAwarePaginator
    {
        return $this->mySupplierRepository->getMySuppliers($userId, $columns);
    }

    public function createMySupplier(array $data): MySupplier
    {
        $data['supplier_name'] = trim($data['supplier_name'] ?? '', ' ');
        $data['company_name'] = isset($data['company_name']) ? trim($data['company_name'], ' ') : null;
        $data['contact'] = isset($data['contact']) ? trim($data['contact'], ' ') : null;
        $data['address'] = isset($data['address']) ? trim($data['address'], ' ') : null;

        return $this->mySupplierRepository->create($data);
    }

    public function getMySupplierById(int $id, array $columns = ['*']): ?MySupplier
    {
        return $this->mySupplierRepository->getById($id, $columns);
    }

    public function updateMySupplier(MySupplier $mySupplier, array $data): MySupplier
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

        return $this->mySupplierRepository->update($mySupplier, $data);
    }

    public function deleteMySupplier(MySupplier $mySupplier): bool
    {
        return $this->mySupplierRepository->delete($mySupplier);
    }

    /**
     * Copy data from global supplier to my supplier
     */
    public function copyFromGlobalSupplier(int $userId, int $globalSupplierId): MySupplier
    {
        $globalSupplier = \App\Models\Supplier::findOrFail($globalSupplierId);

        $data = [
            'user_id' => $userId,
            'supplier_name' => $globalSupplier->name,
            'company_name' => $globalSupplier->company_name,
            'contact' => $globalSupplier->phone,
            'address' => $globalSupplier->address,
        ];

        return $this->createMySupplier($data);
    }
}
