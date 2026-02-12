<?php

namespace App\Http\Controllers\Stores;

use App\Http\Controllers\Controller;
use App\Http\Requests\Stores\StoreRequest;
use App\Http\Requests\Stores\UpdateStoreRequest;
use App\Models\User;
use App\Services\UserService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class StoreController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index()
    {
        return Inertia::render('stores/stores');
    }

    public function store(StoreRequest $request)
    {
        try {
            DB::beginTransaction();
            $user = $this->userService->createUser([
                'email' => $request->input('email'),
                'type' => User::TYPE_STORE,
            ]);

            $this->userService->sendInvite($user);
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

    public function update(UpdateStoreRequest $request)
    {
        dd($request->all());
    }

    public function create() {}

    public function adminEdit() {}

    public function destroyed() {}
}
