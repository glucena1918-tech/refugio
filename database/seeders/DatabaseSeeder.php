<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@refugio.gob.ve'],
            [
                'name' => 'Administrador CUSPAL',
                'password' => Hash::make('admin1918'),
                'role' => 'admin',
                'is_authorized' => true
            ]
        );

        User::updateOrCreate(
            ['email' => 'inspector_ok@refugio.gob.ve'],
            [
                'name' => 'Inspector Autorizado',
                'password' => Hash::make('inspector123'),
                'role' => 'inspector',
                'is_authorized' => true
            ]
        );

        User::updateOrCreate(
            ['email' => 'inspector_no@refugio.gob.ve'],
            [
                'name' => 'Inspector Sin Autorizar',
                'password' => Hash::make('inspector123'),
                'role' => 'inspector',
                'is_authorized' => false
            ]
        );
    }
}
