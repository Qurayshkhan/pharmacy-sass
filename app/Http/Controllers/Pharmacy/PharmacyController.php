<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Http\Requests\PharmacyStoreRequest;
use App\Http\Requests\UpdatePharmacyRequest;
use App\Service\PharmacyService;
use App\Service\UserService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
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
        return Inertia::render('pharmacies/pharmacies');
    }

    public function store(PharmacyStoreRequest $request)
    {
        try {
            DB::beginTransaction();
            $user = $this->userService->createUser($request->validated());
            $this->pharmacyService->createPharmacy(['user_id' => $user->id]);
            $this->userService->sendInvite($user);

            DB::commit();

            return response()->json(['message' => 'Created'], 201);
        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json(['error' => $e->getMessage()], 500);
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
        $user->load('pharmacy');

        return Inertia::render('pharmacies/register', ['user' => $user]);
    }

    public function update(UpdatePharmacyRequest $request)
    {
        // $pharmacy = $this->userService->getUserByUuid
        dd(vars: $request->all());
    }
}
