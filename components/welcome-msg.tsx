"use client"

import { useUser } from "@clerk/nextjs"
import { Skeleton } from "@/components/ui/skeleton"

export const WelcomeMsg = () => {
    const { user, isLoaded } = useUser()

    if (!isLoaded) {
        return (
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-x-2">
                    <Skeleton className="h-8 w-[200px] lg:h-10 lg:w-[300px]" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-5 w-[250px] lg:w-[300px]" />
            </div>
        )
    }

    return (
        <div className="space-y-2 mb-4">
            <div className="flex items-center gap-x-2">
                <h2 className="text-2xl lg:text-4xl text-white font-medium">
                    Welcome Back, {user?.firstName || "User"} 👋🏻
                </h2>
            </div>
            <p className="text-sm lg:text-base text-blue-200">
                This is your Financial Overview Report
            </p>
        </div>
    )
}