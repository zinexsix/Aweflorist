import { Form, Head } from '@inertiajs/react';
import { BrandButton } from '@/components/florify/brand-button';
import { Notice } from '@/components/florify/empty-state';
import { FormField } from '@/components/florify/form-field';
import { PageHeader } from '@/components/florify/page-header';
import { ProductImage } from '@/components/florify/product-image';
import { PriceLabel } from '@/components/florify/product-meta';
import { Section } from '@/components/florify/section';
import { home } from '@/routes';
import { index as catalog, show as catalogShow } from '@/routes/catalog';
import { store } from '@/routes/orders';
import type { Product } from '@/types';

/** Tanggal hari ini dalam format YYYY-MM-DD untuk atribut min input date. */
function todayIso(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${now.getFullYear()}-${month}-${day}`;
}

/**
 * Halaman formulir pemesanan produk (US-13).
 * Produk dikirim OrderController@create; validasi utama dilakukan server.
 */
export default function OrderCreate({ product }: { product: Product }) {
    return (
        <>
            <Head title={`Pesan ${product.name}`} />
            <PageHeader
                breadcrumbs={[
                    { label: 'Beranda', href: home.url() },
                    { label: 'Katalog', href: catalog.url() },
                    {
                        label: product.name,
                        href: catalogShow.url(product.slug),
                    },
                    { label: 'Pesan' },
                ]}
                title="Formulir Pemesanan"
                description="Lengkapi data di bawah ini. Setelah dikirim, pesanan tersimpan dan WhatsApp admin terbuka otomatis dengan nomor pesanan Anda."
            />
            <Section flush aria-label="Formulir pemesanan">
                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
                    <aside className="flex flex-col gap-4">
                        <ProductImage
                            src={product.image}
                            alt={product.name}
                            priority
                            className="rounded-panel"
                        />
                        <div className="flex flex-col gap-2">
                            <h2 className="font-display text-h3 text-brand-900">
                                {product.name}
                            </h2>
                            <PriceLabel product={product} size="lg" />
                            <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                                {product.description}
                            </p>
                        </div>
                    </aside>

                    <Form
                        {...store.form(product.slug)}
                        className="flex flex-col gap-6 rounded-panel border border-line bg-surface p-5 sm:p-8"
                    >
                        {({ processing, errors }) => (
                            <>
                                <FormField
                                    label="Nama"
                                    required
                                    error={errors.name}
                                >
                                    {(field) => (
                                        <input
                                            {...field}
                                            type="text"
                                            name="name"
                                            autoComplete="name"
                                            maxLength={100}
                                            placeholder="Nama lengkap"
                                        />
                                    )}
                                </FormField>

                                <FormField
                                    label="Nomor WhatsApp"
                                    required
                                    hint="Contoh: 0812-3456-7890"
                                    error={errors.phone}
                                >
                                    {(field) => (
                                        <input
                                            {...field}
                                            type="tel"
                                            inputMode="tel"
                                            autoComplete="tel"
                                            name="phone"
                                            placeholder="0812-3456-7890"
                                        />
                                    )}
                                </FormField>

                                <FormField
                                    label="Jumlah"
                                    required
                                    hint="Minimal 1, maksimal 50 buket."
                                    error={errors.quantity}
                                >
                                    {(field) => (
                                        <input
                                            {...field}
                                            type="number"
                                            inputMode="numeric"
                                            name="quantity"
                                            min={1}
                                            max={50}
                                            defaultValue={1}
                                        />
                                    )}
                                </FormField>

                                <FormField
                                    label="Tanggal dibutuhkan"
                                    required
                                    error={errors.needed_at}
                                >
                                    {(field) => (
                                        <input
                                            {...field}
                                            type="date"
                                            name="needed_at"
                                            min={todayIso()}
                                        />
                                    )}
                                </FormField>

                                <FormField
                                    label="Catatan"
                                    hint="Maksimal 500 huruf. Boleh dikosongkan."
                                    error={errors.notes}
                                >
                                    {(field) => (
                                        <textarea
                                            {...field}
                                            name="notes"
                                            rows={4}
                                            maxLength={500}
                                            placeholder="Ucapan di kartu, warna favorit, atau permintaan lain"
                                        />
                                    )}
                                </FormField>

                                <BrandButton
                                    type="submit"
                                    size="lg"
                                    disabled={processing}
                                    className="w-full sm:w-auto sm:self-start"
                                >
                                    {processing
                                        ? 'Mengirim…'
                                        : 'Kirim & Lanjut ke WhatsApp'}
                                </BrandButton>

                                <Notice>
                                    Setelah WhatsApp terbuka, tekan Kirim agar
                                    admin menerima pesanan Anda. Pesanan pasti
                                    setelah admin mengonfirmasi.
                                </Notice>
                            </>
                        )}
                    </Form>
                </div>
            </Section>
        </>
    );
}
