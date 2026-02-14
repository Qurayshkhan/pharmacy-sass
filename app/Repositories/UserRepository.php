<?php

namespace App\Repositories;

use App\Interfaces\UserInterface;
use App\Models\User;

class UserRepository implements UserInterface
{
    public function create(array $data): User
    {
        return User::create($data);
    }

    public function getUserByUuid(string $uuid): ?User
    {
        return User::select('id', 'name', 'email', 'uuid')->where('uuid', $uuid)->first();
    }

    public function updateUserByUuid(string $uuid, array $data): bool
    {
        return User::where('uuid', $uuid)->update($data);
    }

    public function getUserByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function getUserById(int $id): User
    {
        return User::findOrFail($id);
    }

    public function updateUserById($userId, array $data): bool
    {
        return User::where('id', $userId)->update($data);
    }

    public function destroyUserByUuid($uuid): bool|int|null
    {
        return User::where('uuid', $uuid)->delete();
    }
}
