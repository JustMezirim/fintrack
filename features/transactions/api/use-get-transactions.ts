'use client';

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { client } from "@/lib/hono";

export const useGetTransactions = () => {
    const [params, setParams] = useState({ from: "", to: "", accountId: "" });
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            const from = urlParams.get("from") || "";
            const to = urlParams.get("to") || "";
            const accountId = urlParams.get("accountId") || "";

            setParams({ from, to, accountId });
            setIsReady(true);

            console.log("URL Params set:", { from, to, accountId });
        }
    }, []);

    const query = useQuery({
        queryKey: ["transactions", params],
        enabled: isReady,
        queryFn: async () => {
            console.log("Fetching with params:", params);

            const response = await client.api.transactions.$get({
                query: {
                    from: params.from,
                    to: params.to,
                    accountId: params.accountId,
                },
            });

            if (!response.ok) {
                console.error("API failed:", response);
                throw new Error("Failed to fetch transactions");
            }

            const { data } = await response.json();
            console.log("Fetched data:", data);
            return data;
        },
    });

    return query;
};
