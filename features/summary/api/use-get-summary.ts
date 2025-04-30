'use client';

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetSummary = () => {
    const [params, setParams] = useState<URLSearchParams | null>(null);

    // Use useEffect to ensure window is only accessed client-side
    useEffect(() => {
        if (typeof window !== "undefined") {
            const searchParams = new URLSearchParams(window.location.search);
            setParams(searchParams);
        }
    }, []); // This will only run once, when the component mounts

    // Use params only after it's been initialized
    const from = params?.get("from") || "";
    const to = params?.get("to") || "";
    const accountId = params?.get("accountId") || "";

    // Ensure the query doesn't run before params are set
    const query = useQuery({
        queryKey: ["summary", { from, to, accountId }],
        queryFn: async () => {
            if (!params) {
                throw new Error("Params are not initialized yet");
            }
            const response = await client.api.summary.$get({
                query: {
                    from,
                    to,
                    accountId,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch summary");
            }

            const { data } = await response.json();
            return {
                incomeAmount: data.incomeAmount,
                incomeChange: data.remainingChange,
                expensesAmount: data.expensesAmount,
                expensesChange: data.expensesChange,
                remainingAmount: data.remainingAmount,
                remainingChange: data.remainingChange,
                categories: data.categories.map((category) => ({
                    ...category,
                    value: category.value,
                })),
                days: data.days.map((day) => ({
                    ...day,
                    income: day.income,
                    expenses: day.expenses,
                })),
            };
        },
    });

    return query;
};
