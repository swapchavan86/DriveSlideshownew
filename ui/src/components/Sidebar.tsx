import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { GoogleIcon } from './Icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';


export interface Account {
    id: string;
    displayName: string;
    emailAddress: string;
    photoLink: string;
}

interface SidebarProps {
    accounts: Account[];
    activeAccountId: string | null;
    onAccountSwitched: (accountId: string | null) => void;
    onAccountsChanged: () => void;
    isVisible: boolean;
}

const Sidebar = ({ accounts, activeAccountId, onAccountSwitched, onAccountsChanged, isVisible }: SidebarProps) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>, accountId: string) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to disconnect this account?')) {
            await fetch(`${apiBaseUrl}/auth/logout/${accountId}`, { method: 'POST', credentials: 'include' });
            onAccountsChanged();
        }
    };

    // This effect ensures that a newly added account becomes active.
    useEffect(() => {
        if (accounts.length > 0 && !activeAccountId) {
            onAccountSwitched(accounts[0].id);
        } else if (accounts.length > 0 && activeAccountId && !accounts.find(acc => acc.id === activeAccountId)) {
            // If the active account was removed, switch to the first one
            onAccountSwitched(accounts[0].id);
        } else if (accounts.length === 0 && activeAccountId) {
            // No accounts left
            onAccountSwitched(null);
        }
    }, [accounts, activeAccountId, onAccountSwitched]);


    if (!isVisible) return null;

    return (
        <aside className="flex w-64 flex-col border-r bg-card p-4">
            <h2 className="text-lg font-semibold tracking-tight mb-4">Connected Accounts</h2>
            <div className="flex flex-col gap-2 flex-1">
                <TooltipProvider delayDuration={100}>
                    {accounts.map(account => (
                        <Tooltip key={account.id}>
                            <TooltipTrigger asChild>
                                <div
                                    onClick={() => onAccountSwitched(account.id)}
                                    className={cn(
                                        "flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground",
                                        activeAccountId === account.id && "bg-primary text-primary-foreground hover:bg-primary/90"
                                    )}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <img src={account.photoLink} alt={account.displayName} className="h-8 w-8 rounded-full" />
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-sm font-medium truncate">{account.displayName}</span>
                                            <span className="text-xs truncate opacity-70">{account.emailAddress}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={(e) => handleLogout(e, account.id)}>
                                        <LogOut className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                <p>{account.displayName}</p>
                                <p>{account.emailAddress}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </div>
            <Separator className="my-4" />
            <a href={`${apiBaseUrl}/auth/google`} className="w-full">
                <Button variant="outline" className="w-full">
                    <GoogleIcon className="mr-2 h-4 w-4" />
                    Add Another Account
                </Button>
            </a>
        </aside>
    );
};

export default Sidebar;