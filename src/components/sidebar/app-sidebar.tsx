"use client";

import * as React from "react";
import {
  Calendar,
  FolderOpen,
  GalleryVerticalEnd,
  Settings,
  LayoutDashboard,
  // Bell,
  Users,
  CreditCard,
  BarChart3,
  Building2,
  DollarSign,
  Package,
  Building,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./corp-switcher";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { useAuthStore } from "@/features/auth";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();

  const rolesMap = {
    ADMIN: "Administrador",
    RRHH: "Recursos Humanos",
    SUPER_ADMIN: "Super Administrador",
    COLLABRATOR_INTERNAL: "Colaborador Interno",
  };

  const currentUserRole = user?.role || "";
  const currentRoleName =
    rolesMap[currentUserRole as keyof typeof rolesMap] || "Administrador";

  const data = {
    user: {
      name:
        user?.profile?.firstName && user?.profile?.lastName
          ? `${user.profile.firstName} ${user.profile.lastName}`
          : user?.email ?? "Usuario",
      email: user?.email ?? "",
      avatar: "/avatars/admin.jpg",
    },
    currentRole: {
      name: currentRoleName,
      company: "CECAGEM",
      logo: GalleryVerticalEnd,
      image: "/image/logos/logocecagem.png",
    },

    navGroups: [
      {
        label: "General",
        roles: ["ADMIN", "SUPER_ADMIN"],
        items: [
          {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
            collapsible: false,
          },
          // {
          //   title: "Notificaciones",
          //   url: "/dashboard/notifications",
          //   icon: Bell,
          //   collapsible: false,
          // },
        ],
      },
      {
        label: "Gestión Administrativa",
        roles: ["ADMIN", "SUPER_ADMIN", "RRHH"],
        items: [
          {
            title: "Proyectos",
            url: "/contract",
            icon: FolderOpen,
            collapsible: false,
          },
          {
            title: "Servicios",
            url: "/services",
            icon: Settings,
            collapsible: false,
          },
          {
            title: "Entregables",
            url: "/deliverables",
            icon: Package,
            collapsible: false,
          },
          {
            title: "Clientes de Investigación",
            url: "/research-clients",
            icon: Building2,
            collapsible: false,
          },
          {
            title: "Clientes Contables",
            url: "/accounting-clients",
            icon: Building,
            collapsible: false,
          },
          ...(["ADMIN", "SUPER_ADMIN"].includes(currentUserRole)
            ? [
                {
                  title: "Usuarios del sistema",
                  url: "/user",
                  icon: Users,
                  collapsible: false,
                },
              ]
            : []),
          {
            title: "Ingresos y Egresos",
            url: "/account",
            icon: DollarSign,
            collapsible: false,
          },
        ],
      },
      // Herramientas y Configuración - Admins y Super Admins
      {
        label: "Herramientas",
        roles: ["ADMIN", "SUPER_ADMIN", "RRHH"],
        items: [
          {
            title: "Calendario",
            url: "/calendar",
            icon: Calendar,
            collapsible: false,
          },
          {
            title: "Reportes",
            url: "/reports",
            icon: BarChart3,
            collapsible: false,
          },
          {
            title: "Configuración",
            url: "/settings",
            icon: Settings,
            collapsible: false,
          },
        ],
      },
      {
        label: "Mi Área de Trabajo",
        roles: ["COLLABORATOR_INTERNAL", "COLLABORATOR_EXTERNAL"],
        items: [
          {
            title: "Mis Proyectos",
            url: "/my-project",
            icon: FolderOpen,
            collapsible: false,
          },
          {
            title: "Mis Pagos",
            url: "/my-payments",
            icon: CreditCard,
            collapsible: false,
          },
          // {
          //   title: "Calendario Personal",
          //   url: "#",
          //   icon: Calendar,
          //   collapsible: false,
          // },
        ],
      },
    ].filter((group) => group.roles.includes(currentUserRole)),
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher currentRole={data.currentRole} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={data.navGroups} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
