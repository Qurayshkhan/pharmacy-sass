<?php

namespace App\Http\Controllers\Stores;

use App\Http\Controllers\Controller;
use App\Http\Requests\Stores\StoreRequest;
use App\Services\UserService;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StoreController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function edit() {}

    public function store(StoreRequest $storeRequest)
    {
        try {
            DB::beginTransaction();
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
        }
    }

    public function update() {}

    public function create() {}

    public function index()
    {
        return Inertia::render('stores/stores');
    }

    public function adminEdit() {}

    public function destroyed() {}
}
