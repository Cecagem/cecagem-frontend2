"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Info,
  Bell,
  AlertCircle,
  Zap,
  Shield
} from "lucide-react";
import type { IAlert } from "../types/dashboard.types";

interface AlertsSectionProps {
  alerts: IAlert[];
  isLoading?: boolean;
}

export const AlertsSection = ({ alerts, isLoading }: AlertsSectionProps) => {
  const getAlertIcon = (type: IAlert['type']) => {
    switch (type) {
      case 'overdue_payment':
        return <AlertCircle className="h-5 w-5" />;
      case 'contract_expiring':
        return <Clock className="h-5 w-5" />;
      case 'pending_approval':
        return <CheckCircle className="h-5 w-5" />;
      case 'system_notification':
        return <Info className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getAlertConfig = (priority: IAlert['priority']) => {
    switch (priority) {
      case 'critical':
        return {
          bgColor: 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-800 dark:text-red-200',
          iconColor: 'text-red-600 dark:text-red-400',
          badgeVariant: 'destructive' as const,
          icon: AlertTriangle,
        };
      case 'high':
        return {
          bgColor: 'bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30',
          borderColor: 'border-orange-200 dark:border-orange-800',
          textColor: 'text-orange-800 dark:text-orange-200',
          iconColor: 'text-orange-600 dark:text-orange-400',
          badgeVariant: 'secondary' as const,
          icon: Zap,
        };
      case 'medium':
        return {
          bgColor: 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950/30 dark:to-yellow-900/30',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          textColor: 'text-yellow-800 dark:text-yellow-200',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          badgeVariant: 'outline' as const,
          icon: AlertTriangle,
        };
      case 'low':
        return {
          bgColor: 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30',
          borderColor: 'border-blue-200 dark:border-blue-800',
          textColor: 'text-blue-800 dark:text-blue-200',
          iconColor: 'text-blue-600 dark:text-blue-400',
          badgeVariant: 'outline' as const,
          icon: Info,
        };
      default:
        return {
          bgColor: 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-950/30 dark:to-gray-900/30',
          borderColor: 'border-gray-200 dark:border-gray-800',
          textColor: 'text-gray-800 dark:text-gray-200',
          iconColor: 'text-gray-600 dark:text-gray-400',
          badgeVariant: 'outline' as const,
          icon: Bell,
        };
    }
  };

  const getPriorityText = (priority: IAlert['priority']) => {
    switch (priority) {
      case 'critical':
        return 'Crítico';
      case 'high':
        return 'Alto';
      case 'medium':
        return 'Medio';
      case 'low':
        return 'Bajo';
      default:
        return 'Normal';
    }
  };

  const getTypeText = (type: IAlert['type']) => {
    switch (type) {
      case 'overdue_payment':
        return 'Pago Vencido';
      case 'contract_expiring':
        return 'Contrato por Vencer';
      case 'pending_approval':
        return 'Pendiente de Aprobación';
      case 'system_notification':
        return 'Notificación del Sistema';
      default:
        return 'Notificación';
    }
  };

  if (isLoading) {
    return (
      <Card className="border border-border/50 shadow-lg bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-800/50 dark:border-gray-800">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 bg-muted rounded animate-pulse"></div>
            <div className="h-6 bg-muted rounded w-1/3 animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-6 border rounded-xl animate-pulse bg-muted/20">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Agrupar alertas por prioridad
  const groupedAlerts = alerts.reduce((acc, alert) => {
    if (!acc[alert.priority]) {
      acc[alert.priority] = [];
    }
    acc[alert.priority].push(alert);
    return acc;
  }, {} as Record<string, IAlert[]>);

  const priorityOrder = ['critical', 'high', 'medium', 'low'];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30">
              <Bell className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Alertas y Notificaciones</h3>
              <p className="text-sm text-muted-foreground">
                Monitoreo en tiempo real del sistema
              </p>
            </div>
          </div>
          {alerts.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="px-3 py-1">
                {alerts.length} {alerts.length === 1 ? 'alerta' : 'alertas'}
              </Badge>
              {alerts.some(alert => alert.priority === 'critical') && (
                <Badge variant="destructive" className="px-2 py-1 animate-pulse">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Crítico
                </Badge>
              )}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {alerts.length > 0 ? (
          <div className="space-y-4">
            {priorityOrder.map(priority => {
              const priorityAlerts = groupedAlerts[priority];
              if (!priorityAlerts || priorityAlerts.length === 0) return null;

              return (
                <div key={priority} className="space-y-3">
                  {priorityAlerts.map((alert, index) => {
                    const config = getAlertConfig(alert.priority);
                    const AlertIcon = getAlertIcon(alert.type);
                    const PriorityIcon = config.icon;

                    return (
                      <div
                        key={`${priority}-${index}`}
                        className={`p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${config.bgColor} ${config.borderColor} group`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`p-2 rounded-lg bg-background/50 ${config.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                              {AlertIcon}
                            </div>
                            <div className="flex-1 min-w-0 space-y-3">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge 
                                    variant={config.badgeVariant}
                                    className="text-xs font-semibold px-2 py-1"
                                  >
                                    <PriorityIcon className="h-3 w-3 mr-1" />
                                    {getPriorityText(alert.priority)}
                                  </Badge>
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs px-2 py-1"
                                  >
                                    {getTypeText(alert.type)}
                                  </Badge>
                                </div>
                                <p className={`text-sm font-medium leading-relaxed ${config.textColor}`}>
                                  {alert.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-full flex items-center justify-center mb-6">
              <Shield className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Sistema Seguro</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Excelente trabajo. No hay alertas pendientes en este momento. 
              El sistema está funcionando correctamente.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                Monitoreo activo
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};