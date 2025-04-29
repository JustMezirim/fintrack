// /features/accounts/api/use-get-accounts.ts
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { client } from "@/lib/hono";

export const useGetSummary = () => {
    const params = useSearchParams();
    const from = params.get("from") || "";
    const to = params.get("to") || "";
    const accountId = params.get("accountId") || "";

    // Fetch the query from the API using react-query
    const query = useQuery({
        queryKey: ["summary", { from, to, accountId }],
        queryFn: async () => {
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
