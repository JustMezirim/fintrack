import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await client.api.categories.$get();

            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }

            const { data } = await response.json();
            console.log("Fetched categories data:", data);  // Log the data
            if (!data) {
                throw new Error("No categories found");
            }
            return data;
        },
    });
};

