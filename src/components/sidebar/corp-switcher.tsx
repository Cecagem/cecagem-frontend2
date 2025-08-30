import * as React from "react";
import Image from "next/image";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
export function TeamSwitcher({
  currentRole,
}: {
  currentRole: {
    name: string;
    company: string;
    logo: React.ElementType;
    image: string;
  };
}) {
  const { state } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="cursor-default flex flex-row items-center justify-between w-full"
        >
          {state === "collapsed" ? (
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <currentRole.logo className="size-4" />
            </div>
          ) : (
            <div className="flex flex-row items-center justify-center w-full">
              <Image
                src="/image/logos/logocecagem.png"
                alt="CECAGEM logo"
                width={150}
                height={150}
                className="block dark:hidden"
              />
              <Image
                src="/image/logos/logocecagem.png"
                alt="CECAGEM logo"
                width={150}
                height={150}
                className="hidden dark:block"
              />

              {/* <span className="truncate text-sm text-muted-foreground font-medium">
                {currentRole.name}
              </span> */}
            </div>
          )}
        </SidebarMenuButton>
        <Separator orientation="horizontal" className="mt-2" />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
