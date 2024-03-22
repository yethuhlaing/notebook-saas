"use client"

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuLabel, 
    DropdownMenuSeparator,
    DropdownMenuItem, 
    DropdownMenuGroup,
    DropdownMenuSubContent} from "../../components/ui/dropdown-menu";
import { Avatar } from "../../components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { CreditCard, DoorClosed, Home, Settings } from "lucide-react"
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
]

export function UserNav(){
    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 rounded-full">
                        <AvatarImage src="https://github.com/shadcn.png" alt=""/>
                        <AvatarFallback>Jan</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Ye Thu Hlaing</p>
                        <p className="text-xs leading-none text-muted-foreground">yethusteve217@gmail.com</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    { 
                        navItems.map( (item, index) => (
                            <DropdownMenuItem asChild key={index}>
                                <Link href={item.href} className="w-full flex justify-between item-center">
                                    {item.name}
                                    <span>
                                        <item.icon className="w-4 h-4"></item.icon>
                                    </span>
                                </Link>
                            </DropdownMenuItem>
                        ))
                    }
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="w-full flex justify-between item-center" asChild>
                    <LogoutLink>
                        Logout{""}
                        <span>
                            <DoorClosed className="w-4 h-4"></DoorClosed>
                        </span>
                    </LogoutLink>

                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}