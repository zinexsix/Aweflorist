import { MessageCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import type * as React from 'react';
import { BrandButton } from '@/components/florify/brand-button';
import { FormField } from '@/components/florify/form-field';
import { categories } from '@/data/catalog';
import { cn } from '@/lib/utils';
import { customRequestMessage, whatsappUrl } from '@/lib/whatsapp';

const bouquetTypes = [
    ...categories
        .filter((category) => category.slug !== 'buket-custom')
        .map((category) => category.name),
    'Lainnya (jelaskan di catatan)',
];

const MIN_BUDGET = 10000;

type Errors = Partial<
    Record<'bouquetType' | 'budget' | 'themeColor' | 'neededAt', string>
>;

function text(data: FormData, name: string): string {
    const value = data.get(name);

    return typeof value === 'string' ? value : '';
}

function todayIso(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${now.getFullYear()}-${month}-${day}`;
}

/**
 * Formulir permintaan buket custom (PRD 3.2, FR-19/FR-20).
 * Dipakai di /buket-custom dan di detail produk kategori "Buket Custom".
 *
 * Sprint 1: divalidasi di browser lalu dikirim lewat WhatsApp. Data BELUM
 * disimpan ke basis data; validasi server dan penyimpanan masuk Sprint 2
 * (FR-15, FR-16). Unggah gambar referensi (FR-21) juga Sprint 2.
 */
export function CustomBouquetForm({
    reference,
    className,
}: {
    /** Nama model/produk acuan, mis. "Buket Custom Tema Warna". Ikut masuk ke pesan. */
    reference?: string;
    className?: string;
}) {
    const formRef = useRef<HTMLFormElement>(null);
    const [errors, setErrors] = useState<Errors>({});

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const bouquetType = text(data, 'bouquetType');
        const budget = Number(text(data, 'budget'));
        const themeColor = text(data, 'themeColor').trim();
        const neededAt = text(data, 'neededAt');
        const notes = text(data, 'notes').trim();

        const next: Errors = {};

        if (!bouquetType) {
            next.bouquetType = 'Pilih jenis buket.';
        }

        if (!Number.isFinite(budget) || budget < MIN_BUDGET) {
            next.budget = `Masukkan anggaran minimal Rp ${MIN_BUDGET.toLocaleString('id-ID')}.`;
        }

        if (!themeColor) {
            next.themeColor = 'Tulis warna atau tema yang diinginkan.';
        }

        if (!neededAt) {
            next.neededAt = 'Pilih tanggal buket dibutuhkan.';
        } else if (neededAt < todayIso()) {
            next.neededAt = 'Tanggal tidak boleh sebelum hari ini.';
        }

        setErrors(next);

        const firstInvalid = (
            ['bouquetType', 'budget', 'themeColor', 'neededAt'] as const
        ).find((name) => next[name]);

        if (firstInvalid) {
            formRef.current
                ?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
                ?.focus();

            return;
        }

        window.open(
            whatsappUrl(
                customRequestMessage({
                    reference,
                    bouquetType,
                    budget,
                    themeColor,
                    neededAt,
                    notes,
                }),
            ),
            '_blank',
            'noopener,noreferrer',
        );
    }

    return (
        <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className={cn(
                'flex flex-col gap-6 rounded-panel border border-line bg-surface p-5 sm:p-8',
                className,
            )}
        >
            <FormField label="Jenis buket" required error={errors.bouquetType}>
                {(props) => (
                    <select {...props} name="bouquetType" defaultValue="">
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
                {(props) => (
                    <input
                        {...props}
                        name="budget"
                        type="number"
                        inputMode="numeric"
                        min={MIN_BUDGET}
                        step={5000}
                        placeholder="Contoh: 250000"
                    />
                )}
            </FormField>

            <FormField
                label="Warna atau tema"
                required
                error={errors.themeColor}
            >
                {(props) => (
                    <input
                        {...props}
                        name="themeColor"
                        type="text"
                        maxLength={100}
                        placeholder="Contoh: biru pastel, tema wisuda"
                    />
                )}
            </FormField>

            <FormField
                label="Tanggal dibutuhkan"
                required
                error={errors.neededAt}
            >
                {(props) => (
                    <input
                        {...props}
                        name="neededAt"
                        type="date"
                        min={todayIso()}
                    />
                )}
            </FormField>

            <FormField label="Catatan tambahan">
                {(props) => (
                    <textarea
                        {...props}
                        name="notes"
                        rows={4}
                        maxLength={500}
                        placeholder="Jenis bunga favorit, ucapan di kartu, dan permintaan lain"
                    />
                )}
            </FormField>

            <BrandButton
                type="submit"
                size="lg"
                className="w-full sm:w-auto sm:self-start"
            >
                <MessageCircle />
                Kirim lewat WhatsApp
            </BrandButton>
        </form>
    );
}
