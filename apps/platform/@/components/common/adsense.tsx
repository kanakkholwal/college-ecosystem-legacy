"use client";

import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

interface AdComponentProps {
    adSlot: string;
    adFormat?: string;
    adLayout?: string;
}

const AdComponent: React.FC<AdComponentProps> = ({ adSlot, adFormat = 'auto', adLayout = '' }) => {
    const pathname = usePathname();
    useEffect(() => {
        try {
            (window as any).adsbygoogle = (window as any).adsbygoogle || [];
            (window as any).adsbygoogle.push({});
        } catch (e) {
            console.error('Adsense error:', e);
        }
    }, [pathname]); // re-run when route changes

    return (
        <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
            data-ad-slot={adSlot}
            data-ad-format={adFormat}
            data-full-width-responsive="true"
            data-ad-layout={adLayout}
        />
    );
};

export default AdComponent;