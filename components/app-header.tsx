"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  /** Primary CTA, rendered as the rightmost button */
  primaryAction?: {
    label: string;
    href: string;
  };
  /** Extra actions (theme switcher, notifications...) shown before the CTA */
  children?: React.ReactNode;
  className?: string;
}

export function AppHeader({
  title,
  subtitle,
  primaryAction,
  children,
  className,
}: AppHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6",
        className,
      )}
    >
      {/* Mobile sidebar trigger + title */}
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="md:hidden" />

        <div className="min-w-0">
          <h1 className="truncate text-base font-bold tracking-tight text-foreground sm:text-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden max-w-sm truncate text-xs text-muted-foreground sm:block lg:max-w-md">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      {(children || primaryAction) && (
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {children}
          {primaryAction && (
            <Button
              asChild
              className="whitespace-nowrap text-xs shadow-xs sm:text-sm"
            >
              <Link href={primaryAction.href}>
                <Plus className="size-4 shrink-0" />
                {primaryAction.label}
              </Link>
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
