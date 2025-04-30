import { Suspense } from "react";
import { HeaderLogo } from "@/components/header-logo";
import { Navigation } from "@/components/navigation";
import { UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { WelcomeMsg } from "./welcome-msg";
import { Filters } from "./filters";

export const Header = () => {
    return (
        <header className="bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 lg:px-14 pb-36">
            <div className="max-w-screen-2xl mx-auto">
                {/* Top section */}
                <div className="w-full flex flex-col gap-y-4 lg:flex-row lg:items-center lg:justify-between mb-14">
                    {/* Logo on top or left */}
                    <HeaderLogo />

                    {/* Navigation and UserButton together */}
                    <div className="flex items-center justify-between w-full lg:w-auto lg:justify-start lg:gap-x-8">
                        <Navigation />
                        <div className="ml-2">
                            <ClerkLoaded>
                                <UserButton afterSignOutUrl="/" />
                            </ClerkLoaded>
                            <ClerkLoading>
                                <Loader2 className="size-6 animate-spin text-slate-400" />
                            </ClerkLoading>
                        </div>
                    </div>
                </div>

                {/* Below header */}
                <WelcomeMsg />
                
                <Suspense fallback={<div>Loading filters...</div>}>
                    <Filters />
                </Suspense>
            </div>
        </header>
    );
};
