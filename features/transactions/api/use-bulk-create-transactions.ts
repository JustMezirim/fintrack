import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.transactions["bulk-create"]["$post"]>;
type RequestType = { 
    date: Date; 
    accountId: string; 
    amount: number; 
    payee: string; 
    notes?: string; 
    categoryId?: string; 
}[];

export const useBulkCreateTransaction = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.transactions["bulk-create"]["$post"]({ json });
            return await response.json();
        },
        onSuccess: (data, variables) => {
            const createdCount = variables.length;
            const message = createdCount > 1 ? `${createdCount} Transactions created` : "Transaction created";
            toast.success(message);
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['summary'] });
        },
        onError: () => {
            toast.error("Failed to create transaction");
        }
    });

    return mutation;
};
