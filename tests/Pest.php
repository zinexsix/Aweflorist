<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind different classes or traits.
|
*/

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

/**
 * Pesanan/permintaan custom yang tersimpan langsung diarahkan ke wa.me.
 * Kembalikan isi pesan WhatsApp dari header Location.
 */
function whatsappMessageFrom(TestResponse $response): string
{
    $location = (string) $response->headers->get('Location');

    expect($location)->toStartWith('https://wa.me/');

    parse_str((string) parse_url($location, PHP_URL_QUERY), $query);

    return (string) ($query['text'] ?? '');
}

/**
 * Tautan halaman konfirmasi bertanda tangan yang ikut di pesan WhatsApp.
 */
function confirmationLinkFrom(string $message): string
{
    preg_match('/^Detail (?:pesanan|permintaan): (\S+)$/m', $message, $match);

    expect($match)->toHaveKey(1);

    return $match[1];
}
