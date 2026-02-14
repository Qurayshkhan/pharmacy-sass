<?php

namespace App\Interfaces;

use App\Models\User;

interface UserInterface
{
    public function create(array $data): User;

    public function getUserByUuid(string $uuid): ?User;

    public function updateUserByUuid(string $uuid, array $data): bool;

    public function getUserByEmail(string $email): ?User;

    public function getUserById(int $id): ?User;

    public function updateUserById($userId, array $data): bool;

    public function destroyUserByUuid($uuid): bool|int|null;
}
