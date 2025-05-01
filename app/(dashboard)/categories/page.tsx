"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteCategories } from "@/features/categories/api/use-bulk-delete-categories";

export default function CategoriesPageContent() {
  const newCategory = useNewCategory();
  const deleteCategory = useBulkDeleteCategories();
  const categoriesQuery = useGetCategories();
  const categories = Array.isArray(categoriesQuery.data)
    ? categoriesQuery.data
    : categoriesQuery.data
      ? [categoriesQuery.data]
      : [];

  const isDisabled = categoriesQuery.isLoading || deleteCategory.isPending;

  if (categoriesQuery.isLoading) {
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
              <div className="flex justify-end">
                <Skeleton className="h-9 w-[160px]" />
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

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="lg:flex-row lg:items-center lg:justify-between flex flex-col gap-2">
          <div className="flex flex-col">
            <CardTitle className="text-xl line-clamp-1">Categories Page</CardTitle>
            <CardDescription className="text-sm text-gray-500">Manage your categories here.</CardDescription>
          </div>
          <Button onClick={newCategory.onOpen} size="sm">
            <Plus className="size-4 mr-2" />
            Add a New Category
          </Button>
        </CardHeader>
        <CardContent>
            <DataTable
              columns={columns}
              data={categories}
              filterKey="name"
              onDelete={(row) => {
                const ids = row.map((r) => r.original.id);
                deleteCategory.mutate({ ids });
              }}
              disabled={isDisabled}
            />
        </CardContent>
      </Card>
    </div>
  );
}
