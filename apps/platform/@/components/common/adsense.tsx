"use client";

import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import { appConfig } from '~/project.config';
import "./adsense.css";


const adsTypes = {
    "display-horizontal":{
        adSlot:"4288761968",
        adFormat:"auto"
    },
    "display-square":{
        adSlot:"6395200498",
        adFormat:"auto"
    },
    "display-vertical":{
        adSlot:"6395200498",
        adFormat:"auto"
    },
    "multiplex":{
        adSlot:"8619691544",
        adFormat:"autorelaxed"
    },
} as const;


interface AdComponentProps {
    adSlot: keyof typeof adsTypes;
}


const AdsenseAds: React.FC<AdComponentProps> = ({ adSlot}) => {
    const adsProps = adsTypes[adSlot as keyof typeof adsTypes];
    const pathname = usePathname();
    useEffect(() => {
        try {
            (window as any).adsbygoogle = (window as any).adsbygoogle || [];
            (window as any).adsbygoogle.push({});
        } catch (e) {
            console.error('Adsense error:', e);
            document.querySelectorAll('.adsbygoogle').forEach((el) => {
                el.classList.add("error")
            })
        }
    }, [pathname]); // re-run when route changes

    return (
        <div className="adsense-container">
        <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={appConfig.verifications.google_adsense}
            data-ad-slot={adsProps?.adSlot}
            data-ad-format={adsProps?.adFormat}
            data-full-width-responsive="true"
        />
        </div>
    );
};

export default AdsenseAds;