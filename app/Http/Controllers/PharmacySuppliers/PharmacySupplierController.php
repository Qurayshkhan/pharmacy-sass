<?php

namespace App\Http\Controllers\PharmacySuppliers;

use App\Http\Controllers\Controller;
use App\Http\Requests\PharmacySupplierCopyRequest;
use App\Http\Requests\PharmacySupplierStoreRequest;
use App\Http\Requests\PharmacySupplierUpdateRequest;
use App\Models\PharmacySupplier;
use App\Models\User;
use App\Services\PharmacySupplierService;
use App\Services\SupplierService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class PharmacySupplierController extends Controller
{
    protected $pharmacySupplierService;

    protected $supplierService;

    public function __construct(
        PharmacySupplierService $pharmacySupplierService,
        SupplierService $supplierService
    ) {
        $this->pharmacySupplierService = $pharmacySupplierService;
        $this->supplierService = $supplierService;
    }

    public function index()
    {
        $user = auth()->user();
        $pharmacyId = null;

        // Get pharmacy ID based on user type
        if ($user->type === User::TYPE_PHARMACY) {
            $pharmacy = $user->pharmacy;
            if (! $pharmacy) {
                abort(404, 'Pharmacy not found for this user.');
            }
            $pharmacyId = $pharmacy->id;
        } elseif ($user->type === User::TYPE_ADMIN) {
            // Admin can view all, but for now we'll require pharmacy_id in query
            // You can extend this later if needed
            $pharmacyId = request()->get('pharmacy_id');
            if (! $pharmacyId) {
                abort(400, 'Pharmacy ID is required for admin view.');
            }
        } else {
            abort(403);
        }

        return Inertia::render('pharmacy-suppliers/pharmacy-suppliers', [
            'pharmacySuppliers' => Inertia::defer(function () use ($pharmacyId) {
                return $this->pharmacySupplierService->getPharmacySuppliers($pharmacyId, [
                    'id',
                    'pharmacy_id',
                    'supplier_name',
                    'company_name',
                    'contact',
                    'address',
                    'created_at',
                ]);
            }),
            'globalSuppliers' => Inertia::defer(function () {
                // Only show global suppliers for pharmacy users
                if (auth()->user()->type === User::TYPE_PHARMACY) {
                    return $this->supplierService->getAllSuppliersForSelect();
                }

                return [];
            }),
        ]);
    }

    public function store(PharmacySupplierStoreRequest $request)
    {
        try {
            DB::beginTransaction();

            $user = auth()->user();
            $pharmacyId = null;

            // Get pharmacy ID based on user type
            if ($user->type === User::TYPE_PHARMACY) {
                $pharmacy = $user->pharmacy;
                if (! $pharmacy) {
                    return Redirect::back()->with('error', 'Pharmacy not found for this user.');
                }
                $pharmacyId = $pharmacy->id;
            } elseif ($user->type === User::TYPE_ADMIN) {
                // Admin can specify pharmacy_id in request
                $pharmacyId = $request->input('pharmacy_id');
                if (! $pharmacyId) {
                    return Redirect::back()->with('error', 'Pharmacy ID is required.');
                }
            } else {
                abort(403);
            }

            $data = $request->validated();
            $data['pharmacy_id'] = $pharmacyId;

            $pharmacySupplier = $this->pharmacySupplierService->createPharmacySupplier($data);

            DB::commit();

            return Redirect::back()->with('success', "Supplier {$pharmacySupplier->supplier_name} created successfully.");
        } catch (\Exception $e) {
            DB::rollBack();

            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function edit($id)
    {
        $user = auth()->user();
        $pharmacySupplier = $this->pharmacySupplierService->getPharmacySupplierById($id, [
            'id',
            'pharmacy_id',
            'supplier_name',
            'company_name',
            'contact',
            'address',
        ]);

        if (! $pharmacySupplier) {
            abort(404);
        }

        // Check authorization
        if ($user->type === User::TYPE_PHARMACY) {
            $pharmacy = $user->pharmacy;
            if (! $pharmacy || $pharmacySupplier->pharmacy_id !== $pharmacy->id) {
                abort(403);
            }
        }

        $pharmacyId = $pharmacySupplier->pharmacy_id;

        return Inertia::render('pharmacy-suppliers/pharmacy-suppliers', [
            'pharmacySuppliers' => Inertia::defer(function () use ($pharmacyId) {
                return $this->pharmacySupplierService->getPharmacySuppliers($pharmacyId, [
                    'id',
                    'pharmacy_id',
                    'supplier_name',
                    'company_name',
                    'contact',
                    'address',
                    'created_at',
                ]);
            }),
            'pharmacySupplier' => $pharmacySupplier,
            'globalSuppliers' => Inertia::defer(function () {
                if (auth()->user()->type === User::TYPE_PHARMACY) {
                    return $this->supplierService->getAllSuppliersForSelect();
                }

                return [];
            }),
        ]);
    }

    public function update(PharmacySupplierUpdateRequest $request, $id)
    {
        try {
            DB::beginTransaction();

            $user = auth()->user();
            $pharmacySupplier = $this->pharmacySupplierService->getPharmacySupplierById($id);
            if (! $pharmacySupplier) {
                return Redirect::back()->with('error', 'Pharmacy supplier not found.');
            }

            // Check authorization
            if ($user->type === User::TYPE_PHARMACY) {
                $pharmacy = $user->pharmacy;
                if (! $pharmacy || $pharmacySupplier->pharmacy_id !== $pharmacy->id) {
                    abort(403);
                }
            }

            $this->pharmacySupplierService->updatePharmacySupplier($pharmacySupplier, $request->validated());

            DB::commit();

            return Redirect::back()->with('success', "Supplier {$pharmacySupplier->supplier_name} updated successfully.");
        } catch (\Exception $e) {
            DB::rollBack();

            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $user = auth()->user();
            $pharmacySupplier = $this->pharmacySupplierService->getPharmacySupplierById($id);
            if (! $pharmacySupplier) {
                return Redirect::back()->with('error', 'Pharmacy supplier not found.');
            }

            // Check authorization
            if ($user->type === User::TYPE_PHARMACY) {
                $pharmacy = $user->pharmacy;
                if (! $pharmacy || $pharmacySupplier->pharmacy_id !== $pharmacy->id) {
                    abort(403);
                }
            }

            $supplierName = $pharmacySupplier->supplier_name;
            $this->pharmacySupplierService->deletePharmacySupplier($pharmacySupplier);

            return Redirect::back()->with('success', "Supplier {$supplierName} deleted successfully.");
        } catch (\Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    /**
     * Copy supplier from global suppliers
     */
    public function copyFromGlobal(PharmacySupplierCopyRequest $request)
    {
        try {
            DB::beginTransaction();

            $user = auth()->user();
            $pharmacyId = null;
            $globalSupplierId = $request->input('global_supplier_id');

            if (! $globalSupplierId) {
                return Redirect::back()->with('error', 'Global supplier ID is required.');
            }

            // Get pharmacy ID based on user type
            if ($user->type === User::TYPE_PHARMACY) {
                $pharmacy = $user->pharmacy;
                if (! $pharmacy) {
                    return Redirect::back()->with('error', 'Pharmacy not found for this user.');
                }
                $pharmacyId = $pharmacy->id;
            } elseif ($user->type === User::TYPE_ADMIN) {
                $pharmacyId = $request->input('pharmacy_id');
                if (! $pharmacyId) {
                    return Redirect::back()->with('error', 'Pharmacy ID is required.');
                }
            } else {
                abort(403);
            }

            $pharmacySupplier = $this->pharmacySupplierService->copyFromGlobalSupplier($pharmacyId, $globalSupplierId);

            // Override with any additional data from request
            $data = $request->validated();
            if (! empty($data)) {
                $this->pharmacySupplierService->updatePharmacySupplier($pharmacySupplier, $data);
            }

            DB::commit();

            return Redirect::back()->with('success', "Supplier copied from global suppliers successfully.");
        } catch (\Exception $e) {
            DB::rollBack();

            return Redirect::back()->with('error', $e->getMessage());
        }
    }
}
