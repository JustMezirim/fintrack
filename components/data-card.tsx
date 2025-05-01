// components/data-card.tsx
import { IconType } from "react-icons"
import { VariantProps, cva } from "class-variance-authority"
import { cn, formatCurrency, formatPercentage } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CountUp } from "@/components/count-up"
// import { Skeleton } from "@/components/ui/skeleton"
import { DataCardSkeleton } from "@/components/data-card-skeleton";

const boxVariant = cva(
    "rounded-md p-3",
    {
        variants: {
            variants: {
                default: "bg-blue-500/20",
                success: "bg-emerald-500/20",
                danger: "bg-red-500/20",
                warning: "bg-yellow-500/20",
            }
        },
        defaultVariants: {
            variants: "default",
        },
    },
);

const iconVariant = cva(
    "size-6",
    {
        variants: {
            variants: {
                default: "fill-blue-500",
                success: "fill-emerald-500",
                danger: "fill-red-500",
                warning: "fill-yellow-500",
            }
        },
        defaultVariants: {
            variants: "default",
        },
    },
);

type BoxVariants = VariantProps<typeof boxVariant>;
type IconVariants = VariantProps<typeof iconVariant>

interface DataCardProps extends BoxVariants, IconVariants {
    icon: IconType;
    title: string;
    value?: number;
    dateRange: string;
    percentageChange?: number;
    isLoading?: boolean;
}

export const DataCard = ({
    icon: Icon,
    title,
    value = 0,
    variants,
    dateRange,
    percentageChange = 0,
    isLoading = false,
}: DataCardProps) => {
    if (isLoading) {
        return <DataCardSkeleton />;
    }

    return (
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-x-4">
                <div className="space-y-2">
                    <CardTitle className="text-2xl line-clamp-1">
                        {title}
                    </CardTitle>
                    <CardDescription className="line-clamp-1">
                        {dateRange}
                    </CardDescription>
                </div>
                <div
                    className={cn(
                        "shrink-0", 
                        boxVariant({ variants}),
                    )}
                >
                    <Icon className={cn(iconVariant({variants}))}/>
                </div>
            </CardHeader>
            <CardContent>
                <h1 className="font-bold text-2xl mb-2 line-clamp-1 break-all">
                    <CountUp 
                        preserveValue
                        start={0}
                        end={value}
                        decimals={2}
                        decimalPlaces={2}
                        formattingFn={formatCurrency}
                    />
                </h1>
                {/* {percentageChange !== 0 && (
                    <p>
                        {formatPercentage(percentageChange)} from last period
                    </p>
                )} */}
            </CardContent>
        </Card>
    )
}