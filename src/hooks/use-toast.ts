"use client";

import React from "react";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";
export type ToastAction = "created" | "updated" | "deleted" | "error";

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

const defaultMessages = {
  success: {
    created: {
      title: "¡Operación exitosa!",
      description: "El elemento ha sido creado correctamente.",
    },
    updated: {
      title: "¡Actualización exitosa!",
      description: "Los cambios han sido guardados correctamente.",
    },
    deleted: {
      title: "¡Eliminación exitosa!",
      description: "El elemento ha sido eliminado del sistema.",
    },
  },
  error: {
    error: {
      title: "Error en la operación",
      description: "Ha ocurrido un problema. Por favor intenta nuevamente.",
    },
    created: {
      title: "Error al crear",
      description:
        "No se pudo crear el elemento. Verifica los datos e intenta nuevamente.",
    },
    updated: {
      title: "Error al actualizar",
      description: "No se pudieron guardar los cambios. Intenta nuevamente.",
    },
    deleted: {
      title: "Error al eliminar",
      description: "No se pudo eliminar el elemento. Intenta nuevamente.",
    },
  },
  warning: {
    created: {
      title: "Creado con advertencias",
      description:
        "La operación se completó pero hay algunos aspectos a revisar.",
    },
    updated: {
      title: "Actualizado con advertencias",
      description:
        "Los cambios se guardaron pero hay algunos aspectos a revisar.",
    },
    deleted: {
      title: "Eliminado con advertencias",
      description:
        "La eliminación se completó pero hay algunos aspectos a revisar.",
    },
  },
  info: {
    created: {
      title: "Información",
      description:
        "El elemento ha sido creado. Revisa los detalles adicionales.",
    },
    updated: {
      title: "Información",
      description: "Los cambios han sido aplicados. Revisa los detalles.",
    },
    deleted: {
      title: "Información",
      description: "El elemento ha sido eliminado del sistema.",
    },
  },
};

export function useToast() {
  const showToast = (
    type: ToastType,
    action?: ToastAction,
    options?: ToastOptions
  ) => {
    const defaultData =
      action &&
      defaultMessages[type]?.[
        action as keyof (typeof defaultMessages)[typeof type]
      ];

    const title = options?.title || defaultData?.title || "Notificación";
    const description = options?.description || defaultData?.description;
    const duration = options?.duration || 4000;

    const toastOptions = {
      description,
      duration,
      icon: React.createElement(getIcon(type), { className: "h-4 w-4" }),
    };

    switch (type) {
      case "success":
        toast.success(title, toastOptions);
        break;
      case "error":
        toast.error(title, toastOptions);
        break;
      case "warning":
        toast.warning(title, toastOptions);
        break;
      case "info":
        toast.info(title, toastOptions);
        break;
      default:
        toast(title, toastOptions);
    }
  };

  const showSuccess = (action: ToastAction, options?: ToastOptions) => {
    showToast("success", action, options);
  };

  const showError = (action: ToastAction, options?: ToastOptions) => {
    showToast("error", action, options);
  };

  const showWarning = (action: ToastAction, options?: ToastOptions) => {
    showToast("warning", action, options);
  };

  const showInfo = (action: ToastAction, options?: ToastOptions) => {
    showToast("info", action, options);
  };

  const showCustomSuccess = (
    title: string,
    description?: string,
    duration?: number
  ) => {
    showToast("success", undefined, { title, description, duration });
  };

  const showCustomError = (
    title: string,
    description?: string,
    duration?: number
  ) => {
    showToast("error", undefined, { title, description, duration });
  };

  const showCustomWarning = (
    title: string,
    description?: string,
    duration?: number
  ) => {
    showToast("warning", undefined, { title, description, duration });
  };

  const showCustomInfo = (
    title: string,
    description?: string,
    duration?: number
  ) => {
    showToast("info", undefined, { title, description, duration });
  };

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showCustomSuccess,
    showCustomError,
    showCustomWarning,
    showCustomInfo,
  };
}

function getIcon(type: ToastType) {
  switch (type) {
    case "success":
      return CheckCircle2;
    case "error":
      return AlertCircle;
    case "warning":
      return AlertTriangle;
    case "info":
      return Info;
    default:
      return Info;
  }
}
