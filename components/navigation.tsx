"use client"

import { usePathname, useRouter } from "next/navigation";
import { NavButton } from "@/components/nav-button";
import { useMedia } from "react-use"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const routes = [
    {
        href: "/",
        label: "Overview",
    },
    {
        href: "/transactions",
        label: "Transactions",
    },
    {
        href: "/accounts",
        label: "Accounts",
    },
    {
        href: "/categories",
        label: "Categories",
    },
];

export const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter();
    const pathname = usePathname();
    const isMobile = useMedia("(max-width: 1024px)", false)

    const onClick = (href: string) => {
        router.push(href);
        setIsOpen(false)
    }

    if (isMobile) {
        return (
            <div className="flex flex-col items-start w-full mt-2"> 
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition ml-4" /* Added ml-4 for alignment */
                            aria-label="Open navigation menu"
                        >
                            <Menu className="size-5 mr-2" />
  
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="px-4">
                        <VisuallyHidden>
                            <SheetTitle>Navigation Menu</SheetTitle>
                            <SheetDescription>
                                Main navigation links for the application
                            </SheetDescription>
                        </VisuallyHidden>
                        <nav className="flex flex-col gap-y-3 pt-8">
                            {routes.map((route) => (
                                <Button
                                    key={route.href}
                                    variant={route.href === pathname ? "secondary" : "ghost"}
                                    onClick={() => onClick(route.href)}
                                    className="w-full justify-start py-6 text-base"
                                >
                                    {route.label}
                                </Button>
                            ))}
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        )
    }

    return (
        <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
            {routes.map((route) => (
                <NavButton
                    key={route.href}
                    href={route.href}
                    label={route.label}
                    isActive={pathname === route.href}
                />
            ))}
        </nav>
    )
}