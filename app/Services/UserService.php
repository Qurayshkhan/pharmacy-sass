<?php

namespace App\Services;

use App\Mail\SendInviteToUserMail;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class UserService
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function createUser(array $data): User
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        return $this->userRepository->create($data);
    }

    public function inviteUser(array $data): mixed
    {
        $user = $this->createUser($data);

        return $this->sendInvite($user);
    }

    public function sendInvite($user): mixed
    {
        return Mail::to($user->email)->queue(new SendInviteToUserMail($user));
    }

    public function getUserByUuid(string $uuid): ?User
    {
        return $this->userRepository->getUserByUuid($uuid);
    }

    public function checkInviteLinkExpireOrNot($user) {}

    public function updateUser(array $data): bool
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        return $this->userRepository->updateUserByUuid($data['uuid'], $data);
    }

    public function deletePharmacyUser($uuid): ?bool
    {
        return $this->getUserByUuid($uuid)->delete();
    }

    public function deleteUser($uuid)
    {
        return $this->userRepository->destroyUserByUuid($uuid);
    }
}
