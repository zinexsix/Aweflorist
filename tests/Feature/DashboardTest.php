<?php

use App\Models\User;

test('tamu yang membuka dashboard admin diarahkan ke login', function () {
    $this->get(route('admin.dashboard'))
        ->assertRedirect(route('login'));
});

test('admin yang login dapat membuka dashboard', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('admin.dashboard'))
        ->assertOk();
});

test('rute dashboard bawaan mengarah ke area admin', function () {
    $this->get(route('dashboard'))
        ->assertRedirect('/admin');
});
