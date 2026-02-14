<?php

namespace App\Http\Controllers\MySuppliers;

use App\Http\Controllers\Controller;
use App\Http\Requests\MySupplierCopyRequest;
use App\Http\Requests\MySupplierStoreRequest;
use App\Http\Requests\MySupplierUpdateRequest;
use App\Models\User;
use App\Services\MySupplierService;
use App\Services\SupplierService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class MySupplierController extends Controller
{
    protected $mySupplierService;

    protected $supplierService;

    public function __construct(
        MySupplierService $mySupplierService,
        SupplierService $supplierService
    ) {
        $this->mySupplierService = $mySupplierService;
        $this->supplierService = $supplierService;
    }

    public function index()
    {
        $userId = Auth::id();

        return Inertia::render('my-suppliers/my-suppliers', [
            'mySuppliers' => Inertia::defer(function () use ($userId) {
                return $this->mySupplierService->getMySuppliers($userId, [
                    'id',
                    'user_id',
                    'supplier_name',
                    'company_name',
                    'contact',
                    'address',
                    'created_at',
                ]);
            }),
            'globalSuppliers' => Inertia::defer(function () {
                // Only show global suppliers for pharmacy users
                if (auth()->user()->type === User::TYPE_STORE) {
                    return $this->supplierService->getAllSuppliersForSelect();
                }

                return [];
            }),
        ]);
    }

    public function store(MySupplierStoreRequest $request)
    {
        try {
            DB::beginTransaction();

            $user = auth()->user();
            $userId = null;

            // Get user ID based on user type
            if ($user->type === User::TYPE_STORE) {
                $userId = $user->id;
            } elseif ($user->type === User::TYPE_ADMIN) {
                // Admin can specify user_id in request
                $userId = $request->input('user_id');
                if (! $userId) {
                    return Redirect::back()->with('error', 'User ID is required.');
                }
            } else {
                abort(403);
            }

            $data = $request->validated();
            $data['user_id'] = $userId;

            $mySupplier = $this->mySupplierService->createMySupplier($data);

            DB::commit();

            return Redirect::back()->with('success', "Supplier {$mySupplier->supplier_name} created successfully.");
        } catch (\Exception $e) {
            DB::rollBack();

            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function edit($id)
    {
        $user = auth()->user();
        $mySupplier = $this->mySupplierService->getMySupplierById($id, [
            'id',
            'user_id',
            'supplier_name',
            'company_name',
            'contact',
            'address',
        ]);

        if (! $mySupplier) {
            abort(404);
        }

        // Check authorization
        if ($user->type === User::TYPE_STORE) {
            if ($mySupplier->user_id !== $user->id) {
                abort(403);
            }
        }

        $userId = $mySupplier->user_id;

        return Inertia::render('my-suppliers/my-suppliers', [
            'mySuppliers' => Inertia::defer(function () use ($userId) {
                return $this->mySupplierService->getMySuppliers($userId, [
                    'id',
                    'user_id',
                    'supplier_name',
                    'company_name',
                    'contact',
                    'address',
                    'created_at',
                ]);
            }),
            'mySupplier' => $mySupplier,
            'globalSuppliers' => Inertia::defer(function () {
                if (auth()->user()->type === User::TYPE_STORE) {
                    return $this->supplierService->getAllSuppliersForSelect();
                }

                return [];
            }),
        ]);
    }

    public function update(MySupplierUpdateRequest $request, $id)
    {
        try {
            DB::beginTransaction();

            $user = auth()->user();
            $mySupplier = $this->mySupplierService->getMySupplierById($id);
            if (! $mySupplier) {
                return Redirect::back()->with('error', 'My supplier not found.');
            }

            // Check authorization
            if ($user->type === User::TYPE_STORE) {
                if ($mySupplier->user_id !== $user->id) {
                    abort(403);
                }
            }

            $this->mySupplierService->updateMySupplier($mySupplier, $request->validated());

            DB::commit();

            return Redirect::back()->with('success', "Supplier {$mySupplier->supplier_name} updated successfully.");
        } catch (\Exception $e) {
            DB::rollBack();

            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $user = auth()->user();
            $mySupplier = $this->mySupplierService->getMySupplierById($id);
            if (! $mySupplier) {
                return Redirect::back()->with('error', 'My supplier not found.');
            }

            // Check authorization
            if ($user->type === User::TYPE_STORE) {
                if ($mySupplier->user_id !== $user->id) {
                    abort(403);
                }
            }

            $supplierName = $mySupplier->supplier_name;
            $this->mySupplierService->deleteMySupplier($mySupplier);

            return Redirect::back()->with('success', "Supplier {$supplierName} deleted successfully.");
        } catch (\Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    /**
     * Copy supplier from global suppliers
     */
    public function copyFromGlobal(MySupplierCopyRequest $request)
    {
        try {
            DB::beginTransaction();

            $user = auth()->user();
            $userId = null;
            $globalSupplierId = $request->input('global_supplier_id');

            if (! $globalSupplierId) {
                return Redirect::back()->with('error', 'Global supplier ID is required.');
            }

            // Get user ID based on user type
            if ($user->type === User::TYPE_STORE) {
                $userId = $user->id;
            } elseif ($user->type === User::TYPE_ADMIN) {
                $userId = $request->input('user_id');
                if (! $userId) {
                    return Redirect::back()->with('error', 'User ID is required.');
                }
            } else {
                abort(403);
            }

            $mySupplier = $this->mySupplierService->copyFromGlobalSupplier($userId, $globalSupplierId);

            // Override with any additional data from request
            $data = $request->validated();
            if (! empty($data)) {
                $this->mySupplierService->updateMySupplier($mySupplier, $data);
            }

            DB::commit();

            return Redirect::back()->with('success', 'Supplier copied from global suppliers successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return Redirect::back()->with('error', $e->getMessage());
        }
    }
}
