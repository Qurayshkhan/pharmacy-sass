<?php

namespace App\Interface;

use App\Models\User;

interface UserInterface
{
    public function create(array $data): User;

     public function getUserByUuid(string $uuid): ?User;

    public function updateUser(array $data): bool;

    public function getUserByEmail(string $email): ?User;
}
