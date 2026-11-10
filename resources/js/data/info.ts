import type { FaqItem, OrderStep } from '@/types';

/**
 * Alur pemesanan Sprint 2 (PRD 3.1): pesanan dikirim lewat formulir, tersimpan
 * dengan nomor pesanan, lalu dikonfirmasi admin melalui WhatsApp.
 */
export const orderSteps: OrderStep[] = [
    {
        title: 'Pilih produk',
        description:
            'Buka katalog dan pilih rangkaian yang sesuai momen, atau pilih Buket Custom.',
    },
    {
        title: 'Isi formulir',
        description:
            'Isi nama, nomor WhatsApp, tanggal dibutuhkan, dan catatan pesanan.',
    },
    {
        title: 'Simpan nomor pesanan',
        description:
            'Setelah dikirim, Anda mendapat nomor pesanan (AWF) atau nomor permintaan custom (CST).',
    },
    {
        title: 'Konfirmasi dengan admin',
        description:
            'Admin menghubungi Anda lewat WhatsApp untuk mengonfirmasi detail, harga, dan cara pembayaran.',
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
        answer: 'Pilih produk di katalog, tekan Pesan Sekarang, lalu isi formulir. Anda akan mendapat nomor pesanan, dan admin AweFlorist menghubungi Anda lewat WhatsApp.',
    },
    {
        question: 'Apakah harga di katalog sudah final?',
        answer: 'Harga di katalog adalah acuan. Total akhir dikonfirmasi admin melalui WhatsApp sesuai ukuran, bunga, dan permintaan tambahan.',
    },
    {
        question: 'Bisa request warna atau jenis bunga?',
        answer: 'Bisa. Isi formulir Buket Custom dengan warna, tema, dan anggaran Anda. Admin akan membahas detailnya lewat WhatsApp.',
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
