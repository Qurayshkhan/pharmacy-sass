<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminUpdatePharmacyRequest;
use App\Http\Requests\PharmacyStoreRequest;
use App\Http\Requests\UpdatePharmacyRequest;
use App\Service\PharmacyService;
use App\Service\UserService;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
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
            'pharmacies' => Inertia::defer(fn() => $this->pharmacyService->getPharmacies())
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
        if (!$user) {
            abort(404);
        }
        if (Carbon::now() > $user->pharmacy->link_expires_at) {
            abort(403, 'Invite link has expired.');
        }
        if ($user->pharmacy->is_registered) {
            abort(403, "Pharmacy already registered with this link.");
        }

        return Inertia::render('pharmacies/register', ['user' => $user]);
    }

    public function update(UpdatePharmacyRequest $request)
    {
        try {

            DB::beginTransaction();
            $user = $this->userService->getUserByUuid($request->input('uuid'));

            if (!$user) {
                return false;
            }
            $pharmacy = $this->pharmacyService->getPharmacyByUserId($user->id);
            if (!$pharmacy) {
                return false;
            }

            $this->pharmacyService->updatePharmacy($pharmacy, $request->validated());
            $this->userService->updateUser($request->validated());
            DB::commit();
            if($request->is_update_pharmacy){
                return Redirect::route('pharmacies.index')->with('success', 'Pharmacy updated successfully.');
            }
            return Redirect::route('login')->with('success', 'Pharmacy updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
           return Redirect::back()->with('error', 'Failed to update pharmacy.');
        }
    }


}
