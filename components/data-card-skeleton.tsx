// components/data-card-skeleton.tsx
"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const DataCardSkeleton = () => {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="size-10 rounded-md" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-32 mt-2" />
        <Skeleton className="h-4 w-24 mt-4" />
      </CardContent>
    </Card>
  )
}