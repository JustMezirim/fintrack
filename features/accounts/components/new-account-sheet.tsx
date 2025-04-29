import { 
    Sheet, 
    SheetContent, 
    SheetDescription, 
    SheetHeader, 
    SheetTitle, 
} from "@/components/ui/sheet"
import { useNewAccount } from "@/features/accounts/hooks/use-new-account"
import { AccountForm } from "@/features/accounts/components/account-form"
import { FormValue } from "hono/types"
import { insertAccountSchema } from "@/db/schema"
import { z } from "zod"
import { useCreateAccount } from "@/features/accounts/api/use-create-accounts"
import { useQueryClient } from "@tanstack/react-query"

const formSchema = insertAccountSchema.pick({
    name: true,
});

type FormValues = z.input<typeof formSchema>;

export const NewAccountSheet = () => {
    const { isOpen, onClose } = useNewAccount()

    const mutation = useCreateAccount()
    const queryClient = useQueryClient()

    const onSubmit = (values: FormValues) => {
        mutation.mutate({ json: values }, {
            onSuccess: () => {
                // Invalidate or refetch the account list query
                queryClient.invalidateQueries({ queryKey: ["accounts"] })  // 👈 make sure this matches your list query key
                onClose()
            }
        })
    }
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Account
                    </SheetTitle>
                    <SheetDescription>
                        Create a new account to track your transactions.
                    </SheetDescription>
                </SheetHeader>
                <AccountForm 
                    onSubmit={onSubmit} 
                    disabled={mutation.isPending} 
                    defaultValues={{
                        id: "",
                        plaidId: "",
                        name: "",
                        userId: "",
                    }}
                />
            </SheetContent>
        </Sheet>
    )
}