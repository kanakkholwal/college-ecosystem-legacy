import { create } from 'zustand';

export type ClientStoreState = {
    isSidebarOpen: boolean;
};

export const useClientStore = create<ClientStoreState>((set) => ({
    isSidebarOpen: false,
}));