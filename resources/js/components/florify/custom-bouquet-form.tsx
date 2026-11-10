import { Form } from '@inertiajs/react';
import { BrandButton } from '@/components/florify/brand-button';
import { FormField } from '@/components/florify/form-field';
import { cn } from '@/lib/utils';
import { store } from '@/routes/custom';

const MIN_BUDGET = 10000;

/** Tanggal hari ini dalam format YYYY-MM-DD untuk atribut min input date. */
function todayIso(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${now.getFullYear()}-${month}-${day}`;
}

/**
 * Formulir permintaan buket custom (PRD 3.2, FR-19/FR-20, US-15).
 * Dikirim ke server (CustomRequestController@store), divalidasi
 * StoreCustomRequestRequest, lalu diarahkan ke halaman konfirmasi.
 */
export function CustomBouquetForm({
    bouquetTypes,
    reference = null,
    className,
}: {
    /** Pilihan jenis buket dari server (BouquetTypes::all()). */
    bouquetTypes: string[];
    /** Produk acuan jika formulir dibuka dari halaman detail produk. */
    reference?: { slug: string; name: string } | null;
    className?: string;
}) {
    return (
        <Form
            {...store.form()}
            className={cn(
                'flex flex-col gap-6 rounded-panel border border-line bg-surface p-5 sm:p-8',
                className,
            )}
        >
            {({ processing, errors }) => (
                <>
                    {reference && (
                        <input
                            type="hidden"
                            name="product"
                            value={reference.slug}
                        />
                    )}

                    <FormField label="Nama" required error={errors.name}>
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
                        label="Jenis buket"
                        required
                        error={errors.bouquet_type}
                    >
                        {(field) => (
                            <select
                                {...field}
                                name="bouquet_type"
                                defaultValue=""
                            >
                                <option value="" disabled>
                                    Pilih jenis buket
                                </option>
                                {bouquetTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        )}
                    </FormField>

                    <FormField
                        label="Anggaran (Rp)"
                        required
                        hint="Perkiraan anggaran Anda. Harga akhir dikonfirmasi admin."
                        error={errors.budget}
                    >
                        {(field) => (
                            <input
                                {...field}
                                type="number"
                                inputMode="numeric"
                                name="budget"
                                min={MIN_BUDGET}
                                step={5000}
                                placeholder="Contoh: 250000"
                            />
                        )}
                    </FormField>

                    <FormField
                        label="Warna atau tema"
                        required
                        error={errors.theme_color}
                    >
                        {(field) => (
                            <input
                                {...field}
                                type="text"
                                name="theme_color"
                                maxLength={100}
                                placeholder="Contoh: biru pastel, tema wisuda"
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
                        label="Catatan tambahan"
                        hint="Maksimal 500 huruf. Boleh dikosongkan."
                        error={errors.notes}
                    >
                        {(field) => (
                            <textarea
                                {...field}
                                name="notes"
                                rows={4}
                                maxLength={500}
                                placeholder="Jenis bunga favorit, ucapan di kartu, dan permintaan lain"
                            />
                        )}
                    </FormField>

                    {errors.product && (
                        <p
                            role="alert"
                            className="text-sm font-medium text-red-700"
                        >
                            {errors.product}
                        </p>
                    )}

                    <BrandButton
                        type="submit"
                        size="lg"
                        disabled={processing}
                        className="w-full sm:w-auto sm:self-start"
                    >
                        {processing ? 'Mengirim…' : 'Kirim Permintaan'}
                    </BrandButton>
                </>
            )}
        </Form>
    );
}
