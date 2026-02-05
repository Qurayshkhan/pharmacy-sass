<?php

namespace App\Repositories;

use App\Interface\UserInterface;
use App\Models\User;

class UserRepository implements UserInterface
{
    public function create(array $data): User
    {
        return User::create($data);
    }

    public function getUserByUuid(string $uuid): ?User
    {
        return User::where('uuid', $uuid)->first();
    }

    public function updateUser(array $data): bool
    {
        return User::where('uuid', $data['uuid'])->update($data);
    }

    public function getUserByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }
}
