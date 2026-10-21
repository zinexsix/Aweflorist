import type { FaqItem, OrderStep } from '@/types';

/**
 * Alur pemesanan Sprint 1 (PRD 3.1, disederhanakan): pemesanan dilanjutkan
 * melalui WhatsApp. Formulir pemesanan di sistem baru tersedia di Sprint 2.
 */
export const orderSteps: OrderStep[] = [
    {
        title: 'Pilih produk',
        description: 'Buka katalog dan pilih rangkaian yang sesuai momen.',
    },
    {
        title: 'Klik Pesan Sekarang',
        description:
            'WhatsApp terbuka dengan pesan berisi nama produk yang dipilih.',
    },
    {
        title: 'Konfirmasi dengan admin',
        description:
            'Admin mengonfirmasi ketersediaan, total harga, dan cara pembayaran.',
    },
    {
        title: 'Pesanan disiapkan',
        description:
            'Rangkaian disiapkan sesuai tanggal kebutuhan yang disepakati.',
    },
];

/**
 * Jawaban yang menyangkut kebijakan toko (waktu pemesanan, pengiriman,
 * pembayaran) WAJIB dikonfirmasi Product Owner sebelum demo.
 * Jawaban di bawah sengaja tidak menyebut angka/kebijakan yang belum pasti.
 */
export const faqs: FaqItem[] = [
    {
        question: 'Bagaimana cara memesan?',
        answer: 'Pilih produk di katalog, tekan tombol Pesan Sekarang, lalu lanjutkan percakapan dengan admin AweFlorist di WhatsApp.',
    },
    {
        question: 'Apakah harga di katalog sudah final?',
        answer: 'Harga di katalog adalah acuan. Total akhir dikonfirmasi admin melalui WhatsApp sesuai ukuran, bunga, dan permintaan tambahan.',
    },
    {
        question: 'Bisa request warna atau jenis bunga?',
        answer: 'Bisa. Pilih Buket Custom atau sampaikan warna, tema, dan anggaran kepada admin melalui WhatsApp.',
    },
    {
        question: 'Berapa lama sebelum hari H saya harus memesan?',
        answer: 'Sebaiknya pesan lebih awal. Ketersediaan dan waktu pengerjaan akan dikonfirmasi oleh admin saat pemesanan.',
    },
    {
        question: 'Apakah pesanan sudah pasti setelah saya mengirim chat?',
        answer: 'Belum. Pesanan dianggap terkonfirmasi setelah admin menyetujui detail dan harga bersama Anda.',
    },
];
