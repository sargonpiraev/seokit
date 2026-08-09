"use client";

import { GlobeIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { routing } from "@/i18n/routing";
import { localeLabels, switchLocalePath } from "@/lib/locale-path";
import { cn } from "@/lib/utils";

type LocaleSwitcherProps = {
  locale: string;
  label: string;
};

export function LocaleSwitcher({ locale, label }: LocaleSwitcherProps) {
  const pathname = usePathname() || `/${locale}`;
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
        aria-label={label}
      >
        <GlobeIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {routing.locales.map((item) => (
          <DropdownMenuItem
            key={item}
            className={cn("gap-2", item === locale && "bg-accent")}
            onClick={() => {
              router.push(switchLocalePath(pathname, item));
            }}
          >
            <span className="text-muted-foreground w-6 uppercase">{item}</span>
            <span>{localeLabels[item]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
