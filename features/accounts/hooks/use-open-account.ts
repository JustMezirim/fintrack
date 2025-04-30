"use client";

import { useCallback } from "react";

export const useOpenAccount = () => {
    const onOpen = useCallback((id: string) => {
        const params = new URLSearchParams(window.location.search);
        params.set("id", id);
        window.history.pushState(null, "", `?${params.toString()}`);
    }, []);

    const onClose = useCallback(() => {
        const params = new URLSearchParams(window.location.search);
        params.delete("id");
        window.history.pushState(null, "", `?${params.toString()}`);
    }, []);

    return {
        onOpen,
        onClose,
    };
};
