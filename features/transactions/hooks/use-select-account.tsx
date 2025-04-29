import { JSX, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogHeader
} from '@/components/ui/dialog';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useCreateAccount } from '@/features/accounts/api/use-create-accounts';
import { Select } from '@/components/select';

export const useSelectAccount = (): [() => JSX.Element, () => Promise<string | undefined>] => {
    const accountQuery = useGetAccounts();
    const accountMutation = useCreateAccount();

    const onCreateAccount = (name: string) => accountMutation.mutate({ json: { name } });

    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id,
    }));

    const [promise, setPromise] = useState<{ resolve: (value: string | undefined) => void } | null>(null);
    const selectValue = useRef<string>('');

    const confirm = useCallback(() => {
        return new Promise<string | undefined>((resolve) => {
            setPromise({ resolve });
        });
    }, []);

    const handleClose = useCallback(() => {
        setPromise(null);
    }, []);

    const handleConfirm = useCallback(() => {
        promise?.resolve(selectValue.current);
        handleClose();
    }, [promise, handleClose]);

    const handleCancel = useCallback(() => {
        promise?.resolve(undefined);
        handleClose();
    }, [promise, handleClose]);

    const ConfirmationDialog = useCallback(() => (
        <Dialog 
            open={promise !== null}
            onOpenChange={(isOpen) => {
                if (!isOpen) handleClose();
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select Account</DialogTitle>
                    <DialogDescription>Please select an account to continue.</DialogDescription>
                </DialogHeader>
                <Select 
                    placeholder="Select an account"
                    options={accountOptions}
                    onCreate={onCreateAccount}
                    onChange={(value) => (selectValue.current = value ?? '')}
                    disabled={accountQuery.isLoading || accountMutation.isPending}
                />
                <DialogFooter className="pt-2">
                    <Button onClick={handleCancel} variant="outline">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} variant="destructive">
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ), [promise, accountOptions, onCreateAccount, accountQuery.isLoading, accountMutation.isPending, handleCancel, handleConfirm, handleClose]);

    return [ConfirmationDialog, confirm];
};
