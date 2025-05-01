import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = Awaited<ReturnType<typeof client.api.accounts[":id"]["$delete"]>>;

export const useDeleteAccount = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            if (!id) throw new Error("Account ID is required");
            const response = await client.api.accounts[":id"]["$delete"]({ param: { id } });
            return response; 
        },
        onSuccess: (_, __, context) => {
            toast.success("Account deleted successfully");

            queryClient.setQueryData<any[]>(["accounts"], (oldAccounts) => {
                if (!oldAccounts) return [];
                return oldAccounts.filter((account) => account.id !== id);
            });

      
            queryClient.removeQueries({ queryKey: ["accounts", { id }] });
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
