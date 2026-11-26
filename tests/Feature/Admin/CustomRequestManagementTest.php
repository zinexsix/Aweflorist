<?php

use App\Enums\CustomRequestApproval;
use App\Enums\CustomRequestStatus;
use App\Models\CustomRequest;
use App\Models\User;
use Illuminate\Support\Facades\URL;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

test('tamu diarahkan ke halaman login saat membuka kelola buket custom', function () {
    $this->app['auth']->forgetGuards();

    $customRequest = CustomRequest::factory()->create();

    $this->get(route('admin.custom-requests.index'))
        ->assertRedirect(route('login'));

    $this->get(route('admin.custom-requests.show', $customRequest))
        ->assertRedirect(route('login'));

    $this->patch(route('admin.custom-requests.approval', $customRequest), [
        'approval_status' => 'disetujui',
    ])->assertRedirect(route('login'));
});

test('daftar permintaan custom bisa dicari dan difilter berdasarkan persetujuan', function () {
    $pending = CustomRequest::factory()->create([
        'request_number' => 'CST-20260101-AAAAA',
        'approval_status' => CustomRequestApproval::Menunggu,
    ]);
    $approved = CustomRequest::factory()->create([
        'request_number' => 'CST-20260102-BBBBB',
        'approval_status' => CustomRequestApproval::Disetujui,
    ]);
    $approved->customer->update(['name' => 'Pelanggan Unik']);

    $this->get(route('admin.custom-requests.index', ['q' => 'CST-20260102']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/custom-requests/index')
            ->where('requests.total', 1)
            ->where('requests.data.0.requestNumber', 'CST-20260102-BBBBB'));

    $this->get(route('admin.custom-requests.index', ['q' => 'Pelanggan Unik']))
        ->assertInertia(fn (Assert $page) => $page
            ->where('requests.total', 1)
            ->where('requests.data.0.requestNumber', 'CST-20260102-BBBBB'));

    $this->get(route('admin.custom-requests.index', ['persetujuan' => 'menunggu']))
        ->assertInertia(fn (Assert $page) => $page
            ->where('requests.total', 1)
            ->where('requests.data.0.requestNumber', $pending->request_number)
            ->where('requests.data.0.approvalLabel', 'Menunggu persetujuan admin'));
});

test('detail permintaan menampilkan data lengkap dan gambar referensi', function () {
    $customRequest = CustomRequest::factory()->create([
        'reference_image_path' => 'custom-references/contoh.jpg',
        'notes' => 'Catatan uji dari pelanggan.',
    ]);

    $this->get(route('admin.custom-requests.show', $customRequest))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/custom-requests/show')
            ->where('request.requestNumber', $customRequest->request_number)
            ->where('request.customerName', $customRequest->customer->name)
            ->where('request.customerPhone', $customRequest->customer->phone)
            ->where('request.notes', 'Catatan uji dari pelanggan.')
            ->where('request.approvalLabel', 'Menunggu persetujuan admin')
            ->where('request.referenceImageUrl', fn (string $url): bool => str_contains($url, 'custom-references/contoh.jpg'))
            ->where('request.whatsappUrl', fn (string $url): bool => str_starts_with($url, 'https://wa.me/')));
});

test('admin dapat menyetujui permintaan dan konfirmasi pelanggan ikut berubah', function () {
    $customRequest = CustomRequest::factory()->create();

    $this->patch(route('admin.custom-requests.approval', $customRequest), [
        'approval_status' => 'disetujui',
        'approval_note' => 'Detail dan harga disepakati.',
    ])->assertRedirect()->assertSessionHas('success', 'Permintaan disetujui.');

    $customRequest->refresh();

    expect($customRequest->approval_status)->toBe(CustomRequestApproval::Disetujui)
        ->and($customRequest->status)->toBe(CustomRequestStatus::Disepakati)
        ->and($customRequest->approved_at)->not->toBeNull()
        ->and($customRequest->approval_note)->toBe('Detail dan harga disepakati.');

    $this->get(URL::signedRoute('custom.confirmation', $customRequest))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('customRequest.approvalLabel', 'Disetujui')
            ->where('customRequest.statusLabel', 'Disepakati'));
});

test('admin dapat menolak permintaan beserta alasannya', function () {
    $customRequest = CustomRequest::factory()->create();

    $this->patch(route('admin.custom-requests.approval', $customRequest), [
        'approval_status' => 'ditolak',
        'approval_note' => 'Bunga yang diminta tidak tersedia.',
    ])->assertRedirect()->assertSessionHas('success', 'Permintaan ditolak.');

    $customRequest->refresh();

    expect($customRequest->approval_status)->toBe(CustomRequestApproval::Ditolak)
        ->and($customRequest->status)->toBe(CustomRequestStatus::Dibatalkan)
        ->and($customRequest->approved_at)->toBeNull()
        ->and($customRequest->approval_note)->toBe('Bunga yang diminta tidak tersedia.');
});

test('menolak tanpa alasan ditolak dengan pesan bahasa indonesia', function () {
    $customRequest = CustomRequest::factory()->create();

    $this->patch(route('admin.custom-requests.approval', $customRequest), [
        'approval_status' => 'ditolak',
        'approval_note' => '',
    ])->assertSessionHasErrors(['approval_note' => 'Tulis alasan penolakan.']);

    expect($customRequest->fresh()->approval_status)->toBe(CustomRequestApproval::Menunggu);
});

test('nilai persetujuan di luar pilihan ditolak', function (string $value) {
    $customRequest = CustomRequest::factory()->create();

    $this->patch(route('admin.custom-requests.approval', $customRequest), [
        'approval_status' => $value,
    ])->assertSessionHasErrors('approval_status');

    expect($customRequest->fresh()->approval_status)->toBe(CustomRequestApproval::Menunggu);
})->with(['menunggu', 'tidak-valid']);
