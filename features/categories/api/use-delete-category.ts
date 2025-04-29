import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$delete"]>["json"];

export const useDeleteCategory = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            if (!id) throw new Error("Category ID is required");
            const response = await client.api.categories[":id"]["$delete"]({ param: { id } });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Category deleted successfully");

            // Optimistically remove from cache
            queryClient.setQueryData<any[]>(["categories"], (old) => {
                if (!old) return [];
                return old.filter((category) => category.id !== id);
            });

            queryClient.removeQueries({ queryKey: ["categories", { id }] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['summary'] });
        },
        onError: () => {
            toast.error("Failed to delete category");
        },
    });

    return mutation;
};
