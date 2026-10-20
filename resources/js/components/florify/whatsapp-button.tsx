import { MessageCircle } from 'lucide-react';
import type * as React from 'react';
import { BrandButton } from '@/components/florify/brand-button';
import type { BrandButtonProps } from '@/components/florify/brand-button';
import { generalInquiryMessage, whatsappUrl } from '@/lib/whatsapp';

type WhatsAppButtonProps = Pick<
    BrandButtonProps,
    'variant' | 'size' | 'className'
> & {
    /** Pesan awal yang terisi otomatis di WhatsApp. */
    message?: string;
    children?: React.ReactNode;
};

/**
 * CTA WhatsApp. Selalu membuka tab baru dan memakai nomor dari
 * VITE_WHATSAPP_NUMBER. Jangan menulis URL wa.me manual di komponen lain.
 */
export function WhatsAppButton({
    message = generalInquiryMessage,
    children = 'Pesan via WhatsApp',
    variant,
    size,
    className,
}: WhatsAppButtonProps) {
    return (
        <BrandButton
            asChild
            variant={variant}
            size={size}
            className={className}
        >
            <a
                href={whatsappUrl(message)}
                target="_blank"
                rel="noopener noreferrer"
            >
                <MessageCircle />
                {children}
                <span className="sr-only">(membuka WhatsApp di tab baru)</span>
            </a>
        </BrandButton>
    );
}
