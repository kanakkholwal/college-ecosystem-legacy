"use client";

import { useRef } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { useClientStore } from './client-store';

export function StoreInitializer() {
    const initialized = useRef(false);
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (!initialized.current) {
        useClientStore.setState({
            isSidebarOpen: isDesktop,
        });
        initialized.current = true;
    }
    return null;
}

