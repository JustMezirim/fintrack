"use client"
export const dynamic = 'force-dynamic';

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction"
import { Plus } from "lucide-react"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions"
import { Skeleton } from "@/components/ui/skeleton"
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions"
import { UploadButton } from "./upload-button"
import { ImportCard } from "./import-card"
import type { transactions as transactionSchema } from "@/db/schema"
import { useSelectAccount } from "@/features/transactions/hooks/use-select-account"
import { toast } from "sonner"
import { useBulkCreateTransaction } from "@/features/transactions/api/use-bulk-create-transactions"

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
}

const TransactionPageContent = () => {
  const [AccountDialog, confirm] = useSelectAccount()
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST)
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS)

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setVariant(VARIANTS.IMPORT)
    setImportResults(results)
  }

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS)
    setVariant(VARIANTS.LIST)
  }

  const newTransaction = useNewTransaction()
  const createTransactions = useBulkCreateTransaction()
  const deleteTransactions = useBulkDeleteTransactions()
  const transactionQuery = useGetTransactions()

  type Transaction = { id: string; payee: string; accountId: string; [key: string]: any }

  const transactions = transactionQuery.data
    ? Array.isArray(transactionQuery.data)
      ? (transactionQuery.data as Transaction[]).map((t) => ({
          ...t,
          accountName: "Unknown Account",
        }))
      : [
          {
            ...(transactionQuery.data as Transaction),
            accountName: "Unknown Account",
          },
        ]
    : []

  const isDisabled = transactionQuery.isLoading || deleteTransactions.isPending

  const onSubmitImport = async (values: (typeof transactionSchema.$inferInsert)[]) => {
    const accountId = await confirm()

    if (!accountId) {
      return toast.error("Please select an account to continue.")
    }

    const data = values.map((values) => ({
      ...values,
      accountId: accountId || "",
      notes: values.notes ?? undefined,
      categoryId: values.categoryId ?? undefined,
    }))

    createTransactions.mutate(data, {
      onSuccess: () => {
        onCancelImport()
      },
    })
  }

  if (transactionQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <Skeleton className="h-9 w-[140px]" />
                <Skeleton className="h-9 w-[140px]" />
              </div>
              <div className="h-[500px] w-full">
                <Skeleton className="h-full w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard data={importResults.data} onCancel={onCancelImport} onSubmit={onSubmitImport} />
      </>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="lg:flex-row lg:items-center lg:justify-between flex flex-col gap-2">
          <div className="flex flex-col">
            <CardTitle className="text-xl line-clamp-1">
              Transaction History
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Manage your transactions here.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={newTransaction.onOpen} size="sm" className="w-full sm:w-auto">
              <Plus className="size-4 mr-2" />
              New transaction
            </Button>
            <div className="w-full sm:w-auto">
              <UploadButton onUpload={onUpload} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={transactions}
            filterKey="payee"
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id)
              deleteTransactions.mutate({ ids })
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default function TransactionPage() {
  return <TransactionPageContent />
}
