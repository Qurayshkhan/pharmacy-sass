<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);

        $permissions = [
            'view_pharmacies',
            'create_pharmacies',
            'edit_pharmacies',
            'delete_pharmacies',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        $adminRole->syncPermissions($permissions);

        $user = User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'username' => 'super_admin',
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'type' => User::TYPE_ADMIN,
            ]
        );

        // Assign role safely
        $user->syncRoles([$adminRole]);
    }
}
