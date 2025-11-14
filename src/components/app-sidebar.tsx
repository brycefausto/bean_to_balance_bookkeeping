"use client";

import {
  Icon,
  IconBuilding,
  IconDashboard,
  IconHome,
  IconInnerShadowTop,
  IconNotebook,
  IconProps,
  IconReport,
  IconSettings,
  IconTableDashed,
  IconUserCircle,
  IconUsersGroup,
} from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { isArray } from "lodash";

type MenuItem = {
  title: string;
  url: string;
  icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;
  userRoles?: Role | Role[];
};

type MenuData = {
  navMain: MenuItem[];
  navSecondary: MenuItem[];
};

const data: MenuData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: IconUsersGroup,
      userRoles: Role.ADMIN,
    },
    {
      title: "Chart of Accounts",
      url: "/dashboard/chart-of-accounts",
      icon: IconTableDashed,
      userRoles: [Role.OWNER, Role.BOOKKEEPER],
    },
    {
      title: "Journal Entries",
      url: "/dashboard/journal-entries",
      icon: IconNotebook,
      userRoles: [Role.OWNER, Role.BOOKKEEPER],
    },
    {
      title: "General Ledger",
      url: "/dashboard/ledger",
      icon: IconNotebook,
      userRoles: [Role.OWNER, Role.BOOKKEEPER],
    },
        {
      title: "Statements",
      url: "/dashboard/statements",
      icon: IconNotebook,
      userRoles: [Role.OWNER, Role.BOOKKEEPER],
    },
        {
      title: "Reports",
      url: "/dashboard/reports",
      icon: IconReport,
      userRoles: [Role.OWNER, Role.BOOKKEEPER],
    },
    {
      title: "Account",
      url: "/dashboard/account",
      icon: IconUserCircle,
    },
    {
      title: "Company",
      url: "/dashboard/company",
      icon: IconBuilding,
      userRoles: Role.OWNER,
    },
    {
      title: "Setting",
      url: "/dashboard/setting",
      icon: IconSettings,
    },
  ],
  navSecondary: [
    {
      title: "Home",
      url: "/",
      icon: IconHome,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {}

export function AppSidebar({ ...props }: AppSidebarProps) {
  const { user } = useAuth();
  const userRole = user.role || Role.OWNER;

  function filterByRole(menuItems: MenuItem[], role: Role) {
    return menuItems.filter(
      (it) =>
        !it.userRoles ||
        (it.userRoles &&
          ((isArray(it.userRoles) && it.userRoles.includes(role)) ||
            it.userRoles == role))
    );
  }

  const filteredMenuData = Object.fromEntries(
    Object.entries(data).map(([key, menuItems]) => {
      return [key, filterByRole(menuItems, userRole)];
    })
  ) as MenuData;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredMenuData.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary
          items={filteredMenuData.navSecondary}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
