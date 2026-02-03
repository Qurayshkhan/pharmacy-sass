<?php

namespace App\Interface;

use App\Models\User;

interface UserInterface
{
    public function create(array $data): User;
}