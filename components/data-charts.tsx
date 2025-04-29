"use client"

import { useGetSummary } from "@/features/summary/api/use-get-summary"
import { Chart } from "@/components/charts";
import { SpendingPie } from "@/components/spending-pie";

export const DataCharts = () => {
    const { data, isLoading } = useGetSummary();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            <div className="col-span-1 lg:col-span-3 xl:col-span-4">
                <Chart data={data?.days} isLoading={isLoading} />
            </div>
            <div className="col-span-1 lg:col-span-3 xl:col-span-2">
                <SpendingPie data={data?.categories} isLoading={isLoading} />
            </div>
        </div>
    )
}
