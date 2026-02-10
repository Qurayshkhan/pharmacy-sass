<?php

namespace App\Http\Controllers\Suppliers;

use App\Http\Controllers\Controller;
use App\Http\Requests\SupplierStoreRequest;
use App\Http\Requests\SupplierUpdateRequest;
use App\Models\Supplier;
use App\Models\User;
use App\Services\SupplierService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class SupplierController extends Controller
{
    protected $supplierService;

    public function __construct(SupplierService $supplierService)
    {
        $this->supplierService = $supplierService;
    }

    public function index()
    {
        // Only admin can access
        if (auth()->user()->type !== User::TYPE_ADMIN) {
            abort(403);
        }

        return Inertia::render('suppliers/suppliers', [
            'suppliers' => Inertia::defer(function () {
                return $this->supplierService->getSuppliers([
                    'id',
                    'name',
                    'company_name',
                    'phone',
                    'address',
                    'created_at',
                ]);
            }),
        ]);
    }

    public function store(SupplierStoreRequest $request)
    {
        try {
            DB::beginTransaction();
            $supplier = $this->supplierService->createSupplier($request->validated());

            DB::commit();

            return Redirect::back()->with('success', "Supplier {$supplier->name} created successfully.");
        } catch (\Exception $e) {
            DB::rollBack();

            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function edit($id)
    {
        // Only admin can access
        if (auth()->user()->type !== User::TYPE_ADMIN) {
            abort(403);
        }

        $supplier = $this->supplierService->getSupplierById($id, [
            'id',
            'name',
            'company_name',
            'phone',
            'address',
        ]);

        if (! $supplier) {
            abort(404);
        }

        return Inertia::render('suppliers/suppliers', [
            'suppliers' => Inertia::defer(function () {
                return $this->supplierService->getSuppliers([
                    'id',
                    'name',
                    'company_name',
                    'phone',
                    'address',
                    'created_at',
                ]);
            }),
            'supplier' => $supplier,
        ]);
    }

    public function update(SupplierUpdateRequest $request, $id)
    {
        try {
            DB::beginTransaction();

            $supplier = $this->supplierService->getSupplierById($id);
            if (! $supplier) {
                return Redirect::back()->with('error', 'Supplier not found.');
            }

            $this->supplierService->updateSupplier($supplier, $request->validated());

            DB::commit();

            return Redirect::back()->with('success', "Supplier {$supplier->name} updated successfully.");
        } catch (\Exception $e) {
            DB::rollBack();

            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $supplier = $this->supplierService->getSupplierById($id);
            if (! $supplier) {
                return Redirect::back()->with('error', 'Supplier not found.');
            }

            $supplierName = $supplier->name;
            $this->supplierService->deleteSupplier($supplier);

            return Redirect::back()->with('success', "Supplier {$supplierName} deleted successfully.");
        } catch (\Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    /**
     * Get all suppliers for dropdown (used by pharmacies to copy from global)
     */
    public function getAllForSelect()
    {
        return response()->json([
            'suppliers' => $this->supplierService->getAllSuppliersForSelect(),
        ]);
    }
}
