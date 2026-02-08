<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Http\Requests\PharmacyStoreRequest;
use App\Http\Requests\UpdatePharmacyRequest;
use App\Services\PharmacyService;
use App\Services\UserService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class PharmacyController extends Controller
{
    protected $pharmacyService;

    protected $userService;

    public function __construct(PharmacyService $pharmacyService, UserService $userService)
    {
        $this->pharmacyService = $pharmacyService;
        $this->userService = $userService;
    }

    public function index()
    {
        return Inertia::render('pharmacies/pharmacies', [
            'pharmacies' => Inertia::defer(fn () => $this->pharmacyService->getPharmacies(
                ['uuid', 'id', 'license_number', 'contact', 'user_id', 'branch', 'address']
            )),
        ]);
    }

    public function create()
    {
        return Inertia::render('pharmacies/create');
    }

    public function adminEdit($uuid)
    {
        $user = $this->userService->getUserByUuid($uuid);
        if (! $user) {
            abort(404);
        }

        $pharmacy = $this->pharmacyService->getPharmacyByUserId($user->id);
        if (! $pharmacy) {
            abort(404);
        }

        // Load user relationship
        $pharmacy->load('user');

        return Inertia::render('pharmacies/edit', [
            'pharmacy' => $pharmacy,
        ]);
    }

    public function store(PharmacyStoreRequest $request)
    {
        try {
            DB::beginTransaction();
            $user = $this->userService->createUser($request->validated());
            $this->pharmacyService->createPharmacy(['user_id' => $user->id]);
            $this->userService->sendInvite($user);

            DB::commit();

            return Redirect::route('pharmacies.index')->with('success', 'Pharmacy created and invite send successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return Redirect::back()->with('error', 'Failed to create pharmacy.');
        }
    }

    public function edit($uuid)
    {
        $user = $this->userService->getUserByUuid($uuid);
        if (! $user) {
            abort(404);
        }
        if (Carbon::now() > $user->pharmacy->link_expires_at) {
            abort(403, 'Invite link has expired.');
        }
        if ($user->pharmacy->is_registered) {
            abort(403, 'Pharmacy already registered with this link.');
        }

        return Inertia::render('pharmacies/register', ['user' => $user]);
    }

    public function update(UpdatePharmacyRequest $request)
    {
        try {

            DB::beginTransaction();
            $user = $this->userService->getUserByUuid($request->input('uuid'));
            if (! $user) {
                return abort(404, 'User not found');
            }
            $pharmacy = $this->pharmacyService->getPharmacyByUserId($user->id);
            if (! $pharmacy) {
                return abort(404, 'Pharmacy not found');
            }
            $this->pharmacyService->updatePharmacy($pharmacy, $request->validated());
            $this->userService->updateUser([
                'name' => $request->input('name', ''),
                'password' => $request->input('password', ''),
                'uuid' => $request->input('uuid', ''),
                'status' => $request->input('status', 1),
            ]);
            DB::commit();
            if ($request->is_update_pharmacy) {
                return Redirect::route('pharmacies.index')->with('success', 'Pharmacy updated successfully.');
            }

            return Redirect::route('login')->with('success', 'Pharmacy updated successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            DB::rollBack();

            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function destroy($uuid)
    {
        try {
            $this->userService->deletePharmacyUser($uuid);

            return Redirect::route('pharmacies.index')->with('success', 'Pharmacy deleted successfully.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }
}
