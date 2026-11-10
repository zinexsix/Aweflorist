<?php

return [

    /*
    | Nomor WhatsApp admin AweFlorist (format 628xxx, tanpa +). Pelanggan
    | diarahkan ke nomor ini setelah pesanan/permintaan custom tersimpan.
    | Memakai variabel yang sama dengan tombol WhatsApp di frontend.
    */
    'whatsapp_number' => preg_replace('/\D/', '', (string) env('VITE_WHATSAPP_NUMBER', '')),

    /*
    | Akun admin awal yang dibuat `php artisan db:seed` bila diisi.
    */
    'admin' => [
        'name' => env('ADMIN_NAME', 'Admin AweFlorist'),
        'email' => env('ADMIN_EMAIL'),
        'password' => env('ADMIN_PASSWORD'),
    ],

];
