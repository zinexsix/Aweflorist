<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Persetujuan admin untuk permintaan buket custom.
 * Setiap permintaan baru berstatus "menunggu"; admin mengubahnya menjadi
 * "disetujui" atau "ditolak" setelah membahas detail dan harga di WhatsApp.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('custom_requests', function (Blueprint $table) {
            $table->string('approval_status', 20)->default('menunggu')->after('status')->index();
            $table->timestamp('approved_at')->nullable()->after('approval_status');
            $table->text('approval_note')->nullable()->after('approved_at');
        });
    }

    public function down(): void
    {
        Schema::table('custom_requests', function (Blueprint $table) {
            $table->dropIndex(['approval_status']);
            $table->dropColumn(['approval_status', 'approved_at', 'approval_note']);
        });
    }
};
