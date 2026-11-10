<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(CatalogSeeder::class);

        // Akun admin hanya dibuat bila diisi di .env (tidak ada akun contoh).
        $email = config('florify.admin.email');
        $password = config('florify.admin.password');

        if (is_string($email) && $email !== '' && is_string($password) && $password !== '') {
            User::query()->updateOrCreate(
                ['email' => $email],
                ['name' => (string) config('florify.admin.name'), 'password' => Hash::make($password), 'email_verified_at' => now()],
            );
        }
    }
}
