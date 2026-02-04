<?php

namespace App\Service;

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

    public function createUser(array $data):User{
        if(isset($data['password'])){
            $data['password'] = Hash::make($data['password']);
        }
        return $this->userRepository->create($data);
    }

    public function sendInvite($user){
        Mail::to($user->email)->queue(new SendInviteToUserMail($user));
    }
}
