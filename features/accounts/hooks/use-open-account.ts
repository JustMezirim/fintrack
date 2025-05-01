"use client";

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";

export const useOpenAccount = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

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
        id,
        onOpen,
        onClose,
    };
};
