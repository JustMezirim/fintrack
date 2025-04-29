import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>["json"];

export const useDeleteAccount = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            if (!id) throw new Error("Account ID is required");
            const response = await client.api.accounts[":id"]["$delete"]({ param: { id } });
            return response.json();
        },
        onSuccess: (_, __, context) => {
            toast.success("Account deleted successfully");

            // Remove from ["accounts"] list
            queryClient.setQueryData<any[]>(["accounts"], (oldAccounts) => {
                if (!oldAccounts) return [];
                return oldAccounts.filter((account) => account.id !== id);
            });

            // Remove individual account queries (if any)
            queryClient.removeQueries({ queryKey: ["accounts", { id }] });

            // Refresh related data
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to delete account");
        },
    });

    return mutation;
};
