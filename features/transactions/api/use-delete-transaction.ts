import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = Awaited<ReturnType<typeof client.api.transactions[":id"]["$delete"]>>; // Adjusted to match the actual response type

export const useDeleteTransaction = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            if (!id) throw new Error("Account ID is required");
            const response = await client.api.transactions[":id"]["$delete"]({ param: { id } });
            return response; // Directly return the response object
        },
        onSuccess: () => {
            toast.success("Transaction deleted successfully");

            // Optimistically remove from cache
            queryClient.setQueryData<any[]>(["transaction"], (old) => {
                if (!old) return [];
                return old.filter((account) => account.id !== id);
            });

            queryClient.removeQueries({ queryKey: ["transactions", { id }] });
            queryClient.invalidateQueries({ queryKey: ['summary'] });
        },
        onError: () => {
            toast.error("Failed to delete Transaction");
        },
    });

    return mutation;
};
