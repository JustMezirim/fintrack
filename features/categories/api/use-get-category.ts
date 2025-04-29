// /features/accounts/api/use-get-account.ts
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetCategory = (id?: string) => {
    return useQuery({
        enabled: !!id,
        queryKey: ["category", id],
        queryFn: async () => {
            const response = await (client.api.categories as Record<string, any>)[id!].$get();

            if (!response.ok) {
                throw new Error("Failed to fetch category");
            }

            const { data } = await response.json();
            return data;
        },
    });
};
