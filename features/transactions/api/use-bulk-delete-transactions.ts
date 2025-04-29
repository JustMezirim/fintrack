import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.transactions["bulk-delete"]["$post"]>;
type RequestType = { ids: string[] };

export const useBulkDeleteTransactions = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.transactions["bulk-delete"]["$post"]({ json: { ids: json.ids } });
            return await response.json();
        },
        onSuccess: (data, variables) => {
            const deletedCount = variables.ids.length;
            const message = deletedCount > 1 ? `${deletedCount} Transactions deleted` : "Transaction deleted";
            toast.success(message);
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['summary'] });
        },
        onError: () => {
            toast.error("Failed to delete transaction");
        }
    });

    return mutation;
};
