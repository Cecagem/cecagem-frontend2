"use client";

import * as React from "react";
import {
  AudioWaveform,
  Calendar,
  Command,
  FolderOpen,
  GalleryVerticalEnd,
  Settings,
  LayoutDashboard,
  // Bell,
  Users,
  CreditCard,
  BarChart3,
  TrendingUp,
  Upload,
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

const data = {
  user: {
    name: "Admin",
    email: "admin@empresa.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Administración",
      logo: GalleryVerticalEnd,
      plan: "Empresa principal",
    },
    {
      name: "RRHH",
      logo: AudioWaveform,
      plan: "Recursos Humanos",
    },
    {
      name: "Colaborador",
      logo: Command,
      plan: "Equipo colaborador",
    },
  ],

  navGroups: [
    {
      label: "General",
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
      label: "Gestión",
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
              title: "Contables",
              url: "/client/contables",
            },
            {
              title: "Investigación",
              url: "/client/investigacion",
            },
          ],
        },
        {
          title: "Usuarios",
          url: "/user",
          icon: Users,
          collapsible: false,
        },
        {
          title: "Pagos",
          url: "#",
          icon: CreditCard,
          collapsible: false,
        },
      ],
    },
    {
      label: "Herramientas",
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
      label: "Colaboradores",
      items: [
        {
          title: "Mis Proyectos",
          url: "#",
          icon: FolderOpen,
          collapsible: false,
        },
        {
          title: "Reportar Avances",
          url: "#",
          icon: TrendingUp,
          collapsible: false,
        },
        {
          title: "Reportes Finales",
          url: "#",
          icon: Upload,
          collapsible: false,
        },
        {
          title: "Mis Pagos",
          url: "#",
          icon: CreditCard,
          collapsible: false,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
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
