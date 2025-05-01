import {
    Cell,
    Legend,
    RadialBar,
    RadialBarChart,
    ResponsiveContainer,
    Tooltip
} from "recharts";

import { formatCurrency,  } from "@/lib/utils";
import { CategoryTooltip } from "@/components/category-tooltip";

const COLORS = ["#0062FF", "#12C6FF", "#FF647F", "#FF9354"];

type Props = {
    data: {
        name: string;
        value: number;
    }[];
};

export const RadialVariant = ({ data }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="40%"    
                outerRadius="90%"     
                barSize={10}
                data={data.map((item, index) => ({
                    ...item,
                    fill: COLORS[index % COLORS.length]
                }))}
            >
                <RadialBar 
                    label={{
                        position: "insideStart",
                        fill: "#fff",
                        fontSize: "12px"
                    }}
                    background
                    dataKey="value"
                />
                {/* <Tooltip content={<CategoryTooltip />} /> */}
                <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="right"
                    iconType="circle"
                    content={({ payload }: any) => {
                        if (!payload) return null;
                        return (
                            <ul className="flex flex-col space-y-2">
                                {payload.map((entry: any, index: number) => (
                                    <li
                                        key={`item-${index}`}
                                        className="flex items-center space-x-2"
                                    >
                                        <span
                                            className="size-2 rounded-full shrink-0"
                                            style={{ backgroundColor: entry.color }}
                                        />
                                        <div className="space-x-1">
                                            <span className="text-sm text-accent-foreground">
                                                {entry.value}
                                            </span>
                                            <span className="text-sm">
                                                {formatCurrency(entry.payload.value)}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        );
                    }}
                />
            </RadialBarChart>
        </ResponsiveContainer>
    );
};
