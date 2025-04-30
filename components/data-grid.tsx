// components/data-grid.tsx
"use client"
import { FaPiggyBank } from "react-icons/fa"
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6"
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { formatdateRange } from "@/lib/utils";
import { useSearchParams } from "next/navigation"
import { DataCard } from "./data-card";
import { DataCardSkeleton } from "./data-card-skeleton";
// import { Suspense } from "react";

export const DataGrid = () => {
    const { data, isLoading } = useGetSummary()
    const params = useSearchParams();
    const to = params.get("to") || undefined;
    const from = params.get("from") || undefined;

    const dateRangeLabel = formatdateRange({ to, from })

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
                <DataCardSkeleton />
                <DataCardSkeleton />
                <DataCardSkeleton />
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
            <DataCard 
                title="Remaining"
                value={data?.remainingAmount}
                percentageChange={data?.remainingChange}
                icon={FaPiggyBank}
                variants="default"
                dateRange={dateRangeLabel}
            />
            <DataCard 
                title="Income"
                value={data?.incomeAmount}
                percentageChange={data?.incomeChange}
                icon={FaArrowTrendUp}
                variants="success"
                dateRange={dateRangeLabel}
            />
            <DataCard 
                title="Expenses"
                value={data?.expensesAmount}
                percentageChange={data?.expensesChange}
                icon={FaArrowTrendDown}
                variants="danger"
                dateRange={dateRangeLabel}
            />
        </div>
    )
}