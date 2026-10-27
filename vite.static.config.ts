import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

/**
 * Build statis halaman publik untuk Vercel (tanpa Laravel/PHP): `npm run build:static`.
 * Inertia dan Wayfinder diganti modul kecil di resources/js/static/, sehingga
 * kode halaman di resources/js/pages/public tetap sama dengan versi Laravel.
 */

const outDir = resolve(import.meta.dirname, 'dist-static');

// Hanya aset publik yang dibutuhkan; folder public/ juga berisi index.php, build/, hot.
const publicAssets = [
    'images',
    'favicon.ico',
    'favicon.svg',
    'apple-touch-icon.png',
    'robots.txt',
];

function copyPublicAssets(): Plugin {
    return {
        name: 'florify:copy-public-assets',
        apply: 'build',
        closeBundle() {
            publicAssets.forEach((asset) => {
                const source = resolve(import.meta.dirname, 'public', asset);

                if (existsSync(source)) {
                    cpSync(source, resolve(outDir, asset), { recursive: true });
                }
            });
        },
    };
}

export default defineConfig({
    root: resolve(import.meta.dirname, 'resources/js/static'),
    envDir: import.meta.dirname,
    publicDir: false,
    resolve: {
        alias: [
            {
                find: /^@inertiajs\/react$/,
                replacement: resolve(
                    import.meta.dirname,
                    'resources/js/static/inertia.tsx',
                ),
            },
            {
                find: /^@\/routes$/,
                replacement: resolve(
                    import.meta.dirname,
                    'resources/js/static/routes/index.ts',
                ),
            },
            {
                find: /^@\/routes\/catalog$/,
                replacement: resolve(
                    import.meta.dirname,
                    'resources/js/static/routes/catalog.ts',
                ),
            },
            {
                find: '@',
                replacement: resolve(import.meta.dirname, 'resources/js'),
            },
        ],
    },
    plugins: [
        react(),
        babel({
            presets: [reactCompilerPreset()],
        }),
        tailwindcss(),
        copyPublicAssets(),
    ],
    build: {
        outDir,
        emptyOutDir: true,
    },
});
