import type { Tone } from '@/types';

/** Latar lembut untuk placeholder foto dan kartu kategori. */
export const toneBackground: Record<Tone, string> = {
    blush: 'bg-brand-200',
    cream: 'bg-petal-cream',
    sun: 'bg-petal-sun',
    sage: 'bg-petal-sage',
    lilac: 'bg-petal-lilac',
};

const toneOrder: Tone[] = ['blush', 'sun', 'sage', 'lilac', 'cream'];

/** Tone stabil berdasarkan teks (mis. slug) agar warna placeholder tidak berubah-ubah. */
export function toneFor(key: string): Tone {
    let hash = 0;

    for (const char of key) {
        hash = (hash + char.charCodeAt(0)) % toneOrder.length;
    }

    return toneOrder[hash];
}
