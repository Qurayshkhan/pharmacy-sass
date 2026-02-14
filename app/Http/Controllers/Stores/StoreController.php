<?php

namespace App\Http\Controllers\Stores;

use App\Http\Controllers\Controller;
use App\Http\Requests\Stores\RegisterStoreRequest;
use App\Http\Requests\Stores\StoreRequest;
use App\Http\Requests\Stores\UpdateStoreRequest;
use App\Models\User;
use App\Services\StoreService;
use App\Services\UserService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class StoreController extends Controller
{
    protected $userService;

    protected $storeService;

    public function __construct(UserService $userService, StoreService $storeService)
    {
        $this->userService = $userService;
        $this->storeService = $storeService;
    }

    public function index()
    {
        $stores = $this->storeService->getStores();

        return Inertia::render('stores/stores', ['stores' => Inertia::defer(fn () => $stores)]);
    }

    public function store(StoreRequest $request)
    {
        try {
            DB::beginTransaction();
            $this->userService->inviteUser([
                'email' => $request->input('email'),
                'type' => User::TYPE_STORE,
            ]);
            DB::commit();

            return Redirect::back()->with('success', 'Send invite to store successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function edit($uuid)
    {
        $user = $this->userService->getUserByUuid($uuid);
        if (! $user) {
            abort(404);
        }
        if (Carbon::now() > $user->store->link_expiration_date) {
            abort(403, 'Invite link has expired.');
        }
        if ($user->store->is_active) {
            abort(403, 'Store already registered with this link and active.');
        }

        return Inertia::render('stores/register', ['user' => $user]);

    }

    public function registerStore(RegisterStoreRequest $request)
    {
        try {
            DB::beginTransaction();
            $this->storeService->registerStore($request->all());
            DB::commit();

            return Redirect::route('login')->with('success', 'Your account registered successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function update(UpdateStoreRequest $request)
    {
        try {
            DB::beginTransaction();
            $this->storeService->updateStore($request->all());
            DB::commit();

            return Redirect::back()->with('success', 'Store updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function destroy($uuid)
    {
        try {
            DB::beginTransaction();
            $this->userService->deleteUser($uuid);
            DB::commit();

            return Redirect::back()->with('success', 'Store deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return Redirect::back()->with('error', $e->getMessage());
        }
    }
}
