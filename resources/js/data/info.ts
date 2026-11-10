import type { FaqItem, OrderStep } from '@/types';

/**
 * Alur pemesanan Sprint 2 (PRD 3.1): pesanan dikirim lewat formulir, tersimpan
 * dengan nomor pesanan, lalu dikonfirmasi admin melalui WhatsApp.
 */
export const orderSteps: OrderStep[] = [
    {
        title: 'Pilih produk',
        description:
            'Buka katalog dan pilih buket sesuai harga, atau pilih Buket Custom.',
    },
    {
        title: 'Isi formulir',
        description:
            'Isi nama, nomor WhatsApp, tanggal dibutuhkan, dan catatan pesanan.',
    },
    {
        title: 'Lanjut ke WhatsApp',
        description:
            'Pesanan tersimpan dengan nomor AWF (atau CST untuk custom) dan WhatsApp admin terbuka otomatis. Tekan Kirim di WhatsApp.',
    },
    {
        title: 'Konfirmasi dengan admin',
        description:
            'Admin membalas di WhatsApp untuk mengonfirmasi ketersediaan, harga, dan cara pembayaran.',
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
        answer: 'Pilih produk di katalog, tekan Pesan Sekarang, lalu isi formulir. Setelah dikirim, pesanan tersimpan dan WhatsApp admin terbuka otomatis berisi nomor pesanan Anda.',
    },
    {
        question: 'Apakah harga di katalog sudah final?',
        answer: 'Harga di katalog adalah harga buket sesuai foto. Buket bertanda "mulai" dan buket premium dikonfirmasi harganya oleh admin melalui WhatsApp.',
    },
    {
        question: 'Bisa request warna atau tema sendiri?',
        answer: 'Bisa. Isi formulir Buket Custom untuk wisuda atau other occasion, lengkap dengan warna, tema, dan anggaran. Admin membahas detailnya lewat WhatsApp lalu menyetujui permintaan Anda.',
    },
    {
        question: 'Berapa lama sebelum hari H saya harus memesan?',
        answer: 'Sebaiknya pesan lebih awal. Ketersediaan dan waktu pengerjaan akan dikonfirmasi oleh admin saat pemesanan.',
    },
    {
        question: 'Apakah pesanan sudah pasti setelah saya mengirim formulir?',
        answer: 'Belum. Formulir yang terkirim berstatus menunggu konfirmasi. Pesanan dianggap pasti setelah admin menyetujui detail dan harga bersama Anda.',
    },
];
