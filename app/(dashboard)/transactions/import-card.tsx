import { 
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ImportTable } from "./import-table";
import { format, parse } from "date-fns";

const dateFormat = "yyyy-MM-dd HH:mm:ss"
const outputFormat = "yyyy-MM-dd"

const requiredOptions = [
    "amount",
    "date",
    "payee",
];

interface SelectedColumnsState {
    [key:string]: string | null;
}

type Props = {
    data: string[][];
    onCancel: () => void ;
    onSubmit: (data: any) => void;
}

export const ImportCard = ({
    data,
    onCancel,
    onSubmit,
}: Props) => {
    const [selectedColumns, setSelectedColumns] = 
    useState<SelectedColumnsState>({})

    const headers = data[0];
    const body = data.slice(1)

    const onTableHeadSelectChange = (
        columnIndex: number,
        value: string | null
    ) => {
        setSelectedColumns((prev) => {
            const newSelectedColumns = {...prev};

            for (const key in newSelectedColumns) {
                if (newSelectedColumns[key] === value) {
                    newSelectedColumns[key] = null;
                }
            }

            if (value === "skip") {
                value = null;
            }

            newSelectedColumns[`column_${columnIndex}`] = value;
            return newSelectedColumns;
        });
    }

    const progress = Object.values(selectedColumns).filter(Boolean).length;



    const handleContinue = () => {
        const getColumnIndex = (column: string) => {
            return column.split("_")[1];
        };
    
        const mappedData = {
            headers: headers.map((_header, index) => {
                const columnIndex = getColumnIndex(`column_${index}`);
                return selectedColumns[`column_${columnIndex}`] || null;
            }),
            body: body.map((row) => {
                const transformedRow = row.map((cell, index) => {
                    const columnIndex = getColumnIndex(`column_${index}`);
                    return selectedColumns[`column_${columnIndex}`] ? cell : null;
                });
                return transformedRow.every((item) => item === null) ? [] : transformedRow;
            }).filter((row) => row.length > 0),
        };
    
        const arrayOfData = mappedData.body.map((row) => {
            const obj = row.reduce((acc: any, cell, index) => {
                const header = mappedData.headers[index];
                if (header !== null) {
                    acc[header] = cell;
                }
                return acc;
            }, {});
    
            return {
                ...obj,
                date: parse(obj.date, dateFormat, new Date()), // ✅ Parse to Date object
                amount: Number(obj.amount),                   // ✅ Convert to number
                accountId: String(obj.accountId),              // ✅ Force string
                payee: String(obj.payee),                      // ✅ Force string
                notes: obj.notes ? String(obj.notes) : undefined,    // ✅ Optional
                categoryId: obj.categoryId ? String(obj.categoryId) : undefined,  // ✅ Optional
            };
        });
    
        console.log({ arrayOfData }); // For debugging
    
        onSubmit(arrayOfData);
    };
    

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="lg:flex-row lg:items-center lg:justify-between flex flex-col gap-2">
                <div className="flex flex-col">
                    <CardTitle className="text-xl line-clamp-1">
                        Import Transaction
                    </CardTitle>
                    {/* <CardDescription className="text-sm text-gray-500">
                        Manage your transactions here.
                    </CardDescription> */}
                </div>
                <div className="flex flex-wrap flex-col lg:flex-row gap-y-2 items-center gap-x-2">
                    <Button 
                        onClick={onCancel} 
                        size="sm" 
                        className="w-full lg:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm" 
                        className="w-full lg:w-auto"
                        disabled={progress < requiredOptions.length}
                        onClick={handleContinue}
                    >
                        Continue ({progress} / {requiredOptions.length})
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <ImportTable
                    headers={headers}
                    body={body}
                    selectedColumns={selectedColumns}
                    onTableHeadSelectChange={onTableHeadSelectChange}
                />
            </CardContent>
        </Card>
        </div>
    )
}