<?php

namespace App\Services;

use App\Repositories\StoreRepository;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;

class StoreService
{
    public $storeRepository;

    public $userRepository;

    public function __construct(StoreRepository $storeRepository, UserRepository $userRepository)
    {
        $this->storeRepository = $storeRepository;
        $this->userRepository = $userRepository;
    }

    public function getStores()
    {
        return $this->storeRepository->getStores();
    }

    public function updateStore(array $data)
    {
        $storeId = $data['id'];
        $this->storeRepository->updateStore($storeId, ['contact' => $data['contact'], 'address' => $data['address'], 'is_active' => $data['is_active'], 'branch' => $data['branch']]);

        return $this->userRepository->updateUserById($data['user_id'], ['name' => $data['name']]);
    }

    public function registerStore(array $data)
    {
        $userId = $data['user_id'];
        $storeId = $data['id'];
        $isActive = true;
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        $this->storeRepository->updateStore($storeId, ['contact' => $data['contact'], 'address' => $data['address'], 'is_active' => $isActive, 'branch' => $data['branch']]);

        return $this->userRepository->updateUserById($userId,
            ['name' => $data['name'], 'password' => $data['password']]
        );
    }
}
