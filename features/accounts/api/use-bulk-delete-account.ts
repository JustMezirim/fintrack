import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.accounts["bulk-delete"]["$post"]>;
type RequestType = { ids: string[] };

export const useBulkDeleteAccounts = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.accounts["bulk-delete"]["$post"]({ json: { ids: json.ids } });
            return await response.json();
        },
        onSuccess: (data, variables) => {
            const deletedCount = variables.ids.length;
            const message = deletedCount > 1 ? `${deletedCount} Accounts deleted` : "Account deleted";
            toast.success(message);
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
        onError: () => {
            toast.error("Failed to delete account");
        }
    });

    return mutation;
};
