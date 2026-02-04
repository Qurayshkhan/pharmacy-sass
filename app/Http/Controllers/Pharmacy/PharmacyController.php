<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Http\Requests\PharmacyStoreRequest;
use App\Service\PharmacyService;
use App\Service\UserService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PharmacyController extends Controller
{
    protected $pharmacyService, $userService;
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
}
