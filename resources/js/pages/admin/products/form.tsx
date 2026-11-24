import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import AdminPage from '@/components/admin/admin-page';
import InputError from '@/components/input-error';
import { Button, buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard as adminDashboard } from '@/routes/admin';
import {
    index as productsIndex,
    store as productsStore,
    update as productsUpdate,
} from '@/routes/admin/products';
import type { AdminProductForm, Option } from '@/types/admin';

type Props = {
    product: AdminProductForm | null;
    categories: Option[];
    occasions: Option[];
};

type ProductFormData = Omit<AdminProductForm, 'id' | 'image'> & {
    id: number | null;
    image: File | string | null;
};

export default function ProductForm({ product, categories, occasions }: Props) {
    const [preview, setPreview] = useState<string | null>(
        typeof product?.image === 'string' ? product.image : null,
    );

    const form = useForm<ProductFormData>({
        id: product?.id ?? null,
        name: product?.name ?? '',
        slug: product?.slug ?? '',
        category_id: product?.category_id ?? categories[0]?.value ?? '',
        description: product?.description ?? '',
        price: product?.price ?? null,
        price_from: product?.price_from ?? false,
        image: product?.image ?? null,
        is_featured: product?.is_featured ?? false,
        is_active: product?.is_active ?? true,
        occasions: product?.occasions ?? [],
    });

    useEffect(() => {
        const image = form.data.image;

        if (image instanceof File) {
            const url = URL.createObjectURL(image);
            setPreview(url);

            return () => URL.revokeObjectURL(url);
        }

        setPreview(typeof image === 'string' ? image : null);
    }, [form.data.image]);

    const submit = (event: FormEvent) => {
        event.preventDefault();

        const options = { forceFormData: true, preserveScroll: true };

        if (product) {
            form.put(productsUpdate(product.id).url, options);
        } else {
            form.post(productsStore().url, options);
        }
    };

    const toggleOccasion = (id: string) => {
        const selected = form.data.occasions;
        form.setData(
            'occasions',
            selected.includes(id)
                ? selected.filter((item) => item !== id)
                : [...selected, id],
        );
    };

    return (
        <AdminPage
            title={product ? 'Ubah Produk' : 'Tambah Produk'}
            description={
                product
                    ? 'Perbarui data produk di katalog.'
                    : 'Tambahkan produk baru ke katalog.'
            }
            breadcrumbs={[
                { title: 'Dashboard', href: adminDashboard() },
                { title: 'Produk', href: productsIndex() },
                {
                    title: product ? 'Ubah Produk' : 'Tambah Produk',
                    href: productsIndex(),
                },
            ]}
            actions={
                <Link
                    href={productsIndex().url}
                    className={buttonVariants({ variant: 'outline' })}
                >
                    <ArrowLeft />
                    Kembali
                </Link>
            }
        >
            <form
                onSubmit={submit}
                className="grid max-w-4xl gap-6 rounded-lg border border-border bg-card p-6"
            >
                <div className="grid gap-2">
                    <Label htmlFor="name">Nama produk</Label>
                    <Input
                        id="name"
                        value={form.data.name}
                        onChange={(event) =>
                            form.setData('name', event.target.value)
                        }
                        autoComplete="off"
                    />
                    <InputError message={form.errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="slug">
                        Slug{' '}
                        <span className="font-normal text-muted-foreground">
                            (opsional)
                        </span>
                    </Label>
                    <Input
                        id="slug"
                        value={form.data.slug}
                        onChange={(event) =>
                            form.setData('slug', event.target.value)
                        }
                        placeholder="Dibuat otomatis dari nama"
                        autoComplete="off"
                    />
                    <p className="text-xs text-muted-foreground">
                        Huruf kecil, angka, dan tanda hubung. Kosongkan untuk
                        membuat otomatis.
                    </p>
                    <InputError message={form.errors.slug} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="category_id">Kategori</Label>
                    <Select
                        value={form.data.category_id}
                        onValueChange={(value) =>
                            form.setData('category_id', value)
                        }
                    >
                        <SelectTrigger id="category_id" className="w-full">
                            <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem
                                    key={category.value}
                                    value={category.value}
                                >
                                    {category.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                        Kategori harga menyesuaikan otomatis dengan harga.
                    </p>
                    <InputError message={form.errors.category_id} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description">Deskripsi</Label>
                    <textarea
                        id="description"
                        rows={4}
                        value={form.data.description}
                        onChange={(event) =>
                            form.setData('description', event.target.value)
                        }
                        className="flex w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
                    />
                    <InputError message={form.errors.description} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="price">Harga</Label>
                        <Input
                            id="price"
                            type="number"
                            min={1000}
                            max={100000000}
                            value={form.data.price ?? ''}
                            onChange={(event) =>
                                form.setData(
                                    'price',
                                    event.target.value === ''
                                        ? null
                                        : event.target.value,
                                )
                            }
                            placeholder="Kosongkan untuk harga konfirmasi admin"
                        />
                        <InputError message={form.errors.price} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="image">Gambar produk</Label>
                        <Input
                            id="image"
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp"
                            onChange={(event) =>
                                form.setData(
                                    'image',
                                    event.target.files?.[0] ?? null,
                                )
                            }
                        />
                        <p className="text-xs text-muted-foreground">
                            JPG, PNG, atau WebP, maksimal 2 MB.
                        </p>
                        <InputError message={form.errors.image} />
                    </div>
                </div>

                {preview && (
                    <img
                        src={preview}
                        alt="Pratinjau produk"
                        className="h-40 w-40 rounded-md border border-border object-cover"
                    />
                )}

                <fieldset className="grid gap-3 rounded-md border border-border p-4">
                    <legend className="px-1 text-sm font-medium">
                        Pilihan tambahan
                    </legend>
                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="price_from"
                            checked={form.data.price_from}
                            onCheckedChange={(checked) =>
                                form.setData('price_from', checked === true)
                            }
                        />
                        <Label htmlFor="price_from">
                            Tampilkan harga sebagai “Mulai dari”
                        </Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="is_featured"
                            checked={form.data.is_featured}
                            onCheckedChange={(checked) =>
                                form.setData('is_featured', checked === true)
                            }
                        />
                        <Label htmlFor="is_featured">
                            Tampilkan sebagai produk unggulan
                        </Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="is_active"
                            checked={form.data.is_active}
                            onCheckedChange={(checked) =>
                                form.setData('is_active', checked === true)
                            }
                        />
                        <Label htmlFor="is_active">Produk aktif</Label>
                    </div>
                </fieldset>

                <fieldset className="grid gap-3 rounded-md border border-border p-4">
                    <legend className="px-1 text-sm font-medium">Acara</legend>
                    {occasions.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            Belum ada acara.
                        </p>
                    )}
                    {occasions.map((occasion) => (
                        <div
                            key={occasion.value}
                            className="flex items-center gap-3"
                        >
                            <Checkbox
                                id={`occasion-${occasion.value}`}
                                checked={form.data.occasions.includes(
                                    occasion.value,
                                )}
                                onCheckedChange={() =>
                                    toggleOccasion(occasion.value)
                                }
                            />
                            <Label htmlFor={`occasion-${occasion.value}`}>
                                {occasion.label}
                            </Label>
                        </div>
                    ))}
                    <InputError message={form.errors.occasions} />
                </fieldset>

                <div className="flex flex-wrap gap-2">
                    <Button type="submit" disabled={form.processing}>
                        <Save />
                        {form.processing ? 'Menyimpan...' : 'Simpan Produk'}
                    </Button>
                    <Link
                        href={productsIndex().url}
                        className={buttonVariants({ variant: 'ghost' })}
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </AdminPage>
    );
}
