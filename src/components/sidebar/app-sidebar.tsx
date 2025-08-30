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
        roles: ["ADMIN", "SUPER_ADMIN"],
        items: [
          {
            title: "Proyectos",
            url: "/project",
            icon: FolderOpen,
            collapsible: false,
          },
          {
            title: "Clientes",
            url: "#",
            icon: Building2,
            collapsible: true,
            items: [
              {
                title: "Investigación",
                url: "/client/research",
              },
              {
                title: "Contables",
                url: "/client/accounting",
              },
            ],
          },
          {
            title: "Personal",
            url: "/user",
            icon: Users,
            collapsible: false,
          },
          {
            title: "Gestión de Pagos",
            url: "/payment",
            icon: CreditCard,
            collapsible: false,
          },
        ],
      },
      {
        label: "Gestión Administrativa",
        roles: ["RRHH"],
        items: [
          {
            title: "Proyectos",
            url: "/project",
            icon: FolderOpen,
            collapsible: false,
          },
          {
            title: "Clientes",
            url: "#",
            icon: Building2,
            collapsible: true,
            items: [
              {
                title: "Investigación",
                url: "/client/research",
              },
              {
                title: "Contables",
                url: "/client/accounting",
              },
            ],
          },
          {
            title: "Gestión de Pagos",
            url: "/payment",
            icon: CreditCard,
            collapsible: false,
          },
        ],
      },
      // {
      //   label: "Recursos Humanos",
      //   roles: ["RRHH", "SUPER_ADMIN"],
      //   items: [
      //     {
      //       title: "Colaboradores",
      //       url: "/user",
      //       icon: Users,
      //       collapsible: false,
      //     },
      //     {
      //       title: "Asignación de Proyectos",
      //       url: "/project",
      //       icon: FolderOpen,
      //       collapsible: false,
      //     },
      //     {
      //       title: "Pagos a Colaboradores",
      //       url: "/payment",
      //       icon: CreditCard,
      //       collapsible: false,
      //     },
      //     {
      //       title: "Reportes de Productividad",
      //       url: "#",
      //       icon: BarChart3,
      //       collapsible: false,
      //     },
      //   ],
      // },
      // Herramientas y Configuración - Admins y Super Admins
      {
        label: "Herramientas",
        roles: ["ADMIN", "SUPER_ADMIN"],
        items: [
          {
            title: "Calendario",
            url: "#",
            icon: Calendar,
            collapsible: false,
          },
          {
            title: "Reportes",
            url: "#",
            icon: BarChart3,
            collapsible: false,
          },
          {
            title: "Configuración",
            url: "#",
            icon: Settings,
            collapsible: false,
          },
        ],
      },
      {
        label: "Herramientas",
        roles: ["RRHH"],
        items: [
          {
            title: "Calendario",
            url: "#",
            icon: Calendar,
            collapsible: false,
          },
          {
            title: "Reportes",
            url: "#",
            icon: BarChart3,
            collapsible: false,
          },
          {
            title: "Configuración",
            url: "#",
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
            url: "#",
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