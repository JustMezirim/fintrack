import { 
    Sheet, 
    SheetContent, 
    SheetDescription, 
    SheetHeader, 
    SheetTitle, 
} from "@/components/ui/sheet"
import {  } from "@/features/accounts/hooks/use-new-account"
import { AccountForm } from "@/features/accounts/components/account-form"
import { FormValue } from "hono/types"
import { insertAccountSchema } from "@/db/schema"
import { z } from "zod"
import { useQueryClient } from "@tanstack/react-query"
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account"
import { useGetAccount } from "@/features/accounts/api/use-get-account"
import { useEditAccount } from "@/features/accounts/api/use-edit-account"
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account"
import { Loader2 } from "lucide-react"
import { useConfirm } from "@/hooks/use-confirm"
import { on } from "events"

const formSchema = insertAccountSchema.pick({
    name: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditAccountSheet = () => {
    const { isOpen, onClose, id } = useOpenAccount()

    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",    
        "You are about to delete this account. This action cannot be undone."
    );

    const accountQuery = useGetAccount(id)
    const editMutation = useEditAccount(id)
    const deleteMutation = useDeleteAccount(id)
    const queryClient = useQueryClient()

    const isPending = editMutation.isPending || deleteMutation.isPending
    const isLoading = accountQuery.isLoading;


    const onSubmit = (values: FormValues) => {
        editMutation.mutate({ param: { id }, json: values }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["accounts"] })
                onClose()
            }
        })
    }

    const onDelete = async () => {
        const ok = await confirm();

        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose()
                }
            })
        }
    }

    const defaultValues = accountQuery.data ? {
        id: accountQuery.data.id || "",
        plaidId: accountQuery.data.plaidId || "",
        name: accountQuery.data.name,
        userId: accountQuery.data.userId || "",
    } : {
        id: "",
        plaidId: "",
        name: "",
        userId: "",
    };

    return (
        <>
        <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>
                            Edit Account
                        </SheetTitle>
                        <SheetDescription>
                            Edit your account details to keep your transactions up to date.
                        </SheetDescription>
                    </SheetHeader>
                    {
                        isLoading 
                        ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="size-4 text-muted-foreground animate-spin" />
                            </div>
                        ) : (
                            <AccountForm 
                                id={id}
                                onSubmit={onSubmit} 
                                disabled={isPending} 
                                defaultValues={defaultValues}
                                onDelete={onDelete}
                            />
                        )
                    }
                
                </SheetContent>
            </Sheet>
        </>
    )
}