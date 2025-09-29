"use client";

import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  MapPin,
  GraduationCap,
  Building,
  BookOpen,
  Award,
  DollarSign,
  Shield,
  CheckCircle,
  XCircle,
} from 'lucide-react';

import type { IUser } from '../types/user.types';
import { UserRole, requiresContract } from '../types/user.types';

interface UserViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IUser | null;
}

export function UserViewDialog({
  open,
  onOpenChange,
  user,
}: UserViewDialogProps) {
  if (!user) return null;

  const formatDate = (dateString: string) => {
    try {
      if (dateString.includes('T00:00:00')) {
        const dateParts = dateString.split('T')[0].split('-');
        const localDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
        return format(localDate, "dd 'de' MMMM 'de' yyyy", { locale: es });
      }
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: es });
    } catch {
      return 'Fecha inválida';
    }
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return 'No definido';
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getRoleInfo = (role: UserRole) => {
    const roleConfig = {
      [UserRole.SUPER_ADMIN]: { 
        label: 'Super Administrador', 
        variant: 'destructive' as const,
        description: 'Acceso total al sistema con permisos administrativos completos'
      },
      [UserRole.ADMIN]: { 
        label: 'Administrador', 
        variant: 'secondary' as const,
        description: 'Gestión administrativa del sistema y usuarios'
      },
      [UserRole.COLLABORATOR_INTERNAL]: { 
        label: 'Colaborador Interno', 
        variant: 'default' as const,
        description: 'Colaborador con contrato interno de CECAGEM'
      },
      [UserRole.COLLABORATOR_EXTERNAL]: { 
        label: 'Colaborador Externo', 
        variant: 'outline' as const,
        description: 'Colaborador externo sin vínculo contractual directo'
      },
      [UserRole.RRHH]: { 
        label: 'Recursos Humanos', 
        variant: 'secondary' as const,
        description: 'Gestión de personal y recursos humanos'
      },
    };
    return roleConfig[role] || { 
      label: role, 
      variant: 'outline' as const, 
      description: 'Rol personalizado' 
    };
  };

  const hasContract = requiresContract(user.role);
  const roleInfo = getRoleInfo(user.role);
  const hasAcademicInfo = user.profile.university || user.profile.faculty || user.profile.career || user.profile.academicDegree;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-w-[95vw] max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <div className="font-semibold">
                {user.profile.firstName} {user.profile.lastName}
              </div>
              <div className="text-sm text-muted-foreground font-normal">
                {user.email}
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Badge variant={roleInfo.variant} className="text-xs">
              {roleInfo.label}
            </Badge>
            <Badge variant={user.isActive ? "default" : "secondary"} className="text-xs">
              {user.isActive ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1 text-muted-foreground" />
                  Activo
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1 text-muted-foreground" />
                  Inactivo
                </>
              )}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Teléfono:</span>
                  <span>{user.profile.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Documento:</span>
                  <span>{user.profile.documentType} - {user.profile.documentNumber}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Académica */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Información Académica
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasAcademicInfo ? (
                <div className="grid grid-cols-1 gap-3">
                  {user.profile.university && (
                    <div className="flex items-start gap-2 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="font-medium">Universidad:</span>
                        <div className="text-muted-foreground">{user.profile.university}</div>
                      </div>
                    </div>
                  )}
                  {user.profile.faculty && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="font-medium">Facultad:</span>
                        <div className="text-muted-foreground">{user.profile.faculty}</div>
                      </div>
                    </div>
                  )}
                  {user.profile.career && (
                    <div className="flex items-start gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="font-medium">Carrera:</span>
                        <div className="text-muted-foreground">{user.profile.career}</div>
                      </div>
                    </div>
                  )}
                  {user.profile.academicDegree && (
                    <div className="flex items-start gap-2 text-sm">
                      <Award className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="font-medium">Grado Académico:</span>
                        <div className="text-muted-foreground">{user.profile.academicDegree}</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic">
                  Sin información académica registrada
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rol y Permisos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Rol y Permisos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant={roleInfo.variant}>
                    {roleInfo.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {roleInfo.description}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Estado del usuario:</span>
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1 text-muted-foreground" />
                        Cuenta activa
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1 text-muted-foreground" />
                        Cuenta inactiva
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de Contrato */}
          {hasContract && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Información de Contrato
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Salario Mensual:</span>
                    <span className="font-mono">{formatCurrency(user.profile.salaryMonth)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Fecha de Pago:</span>
                    <span>
                      {user.profile.paymentDate 
                        ? formatDate(user.profile.paymentDate)
                        : 'No definida'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}