"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  Calendar,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useCurrentUser } from "../hooks/use-profile";

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "bg-purple-500 hover:bg-purple-600 text-white";
    case "ADMIN":
      return "bg-primary hover:bg-primary/90 text-primary-foreground";
    case "RRHH":
      return "bg-blue-500 hover:bg-blue-600 text-white";
    case "COLLABRATOR_INTERNAL":
      return "bg-green-500 hover:bg-green-600 text-white";
    case "COLLABORATOR_EXTERNAL":
      return "bg-orange-500 hover:bg-orange-600 text-white";
    default:
      return "bg-muted hover:bg-muted/80 text-muted-foreground";
  }
};

const getRoleDisplayName = (role: string) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super Administrador";
    case "ADMIN":
      return "Administrador";
    case "RRHH":
      return "Recursos Humanos";
    case "COLLABRATOR_INTERNAL":
      return "Colaborador Interno";
    case "COLLABORATOR_EXTERNAL":
      return "Colaborador Externo";
    default:
      return role;
  }
};

export function ProfileView() {
  const { data: user, isLoading, error } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-destructive/50 bg-destructive/10 dark:border-destructive dark:bg-destructive/20">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <AlertDescription className="text-destructive">
          Error al cargar la información del perfil. Por favor, intenta
          nuevamente.
        </AlertDescription>
      </Alert>
    );
  }

  if (!user) {
    return (
      <Alert className="border-yellow-500/50 bg-yellow-50 dark:border-yellow-500 dark:bg-yellow-500/20">
        <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        <AlertDescription className="text-yellow-800 dark:text-yellow-200">
          No se encontró información del perfil.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-card border rounded-lg p-6 shadow-lg">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="h-20 w-20 bg-primary rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              {user.profile.firstName} {user.profile.lastName}
            </h1>
            <div className="flex items-center gap-3">
              <Badge className={getRoleBadgeVariant(user.role)}>
                {getRoleDisplayName(user.role)}
              </Badge>
              <Badge
                variant={user.isActive ? "default" : "secondary"}
                className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 text-green-800 dark:text-green-300"
              >
                {user.isActive ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-primary">
                  Información Personal
                </CardTitle>
                <CardDescription>
                  Datos personales y de contacto
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="font-medium text-muted-foreground">
                  Email:
                </span>
              </div>
              <span className="text-foreground">{user.email}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="font-medium text-muted-foreground">
                  Teléfono:
                </span>
              </div>
              <span className="text-foreground">{user.profile.phone}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <span className="font-medium text-muted-foreground">
                Tipo de Documento:
              </span>
              <span className="text-foreground">
                {user.profile.documentType}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="font-medium text-muted-foreground">
                Número de Documento:
              </span>
              <span className="text-foreground font-mono">
                {user.profile.documentNumber}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-primary">
                  Información Académica
                </CardTitle>
                <CardDescription>Formación y estudios</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-primary" />
                <span className="font-medium text-muted-foreground">
                  Universidad:
                </span>
              </div>
              <span className="text-foreground text-right">
                {user.profile.university}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <span className="font-medium text-muted-foreground">
                Facultad de Educación:
              </span>
              <span className="text-foreground text-right">
                {user.profile.faculty}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <span className="font-medium text-muted-foreground">
                Carrera:
              </span>
              <span className="text-foreground text-right">
                {user.profile.career}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="font-medium text-muted-foreground">
                Grado Académico:
              </span>
              <span className="text-foreground text-right">
                {user.profile.academicDegree}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employment Information */}
      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-primary">
                Información Laboral
              </CardTitle>
              <CardDescription>Datos de empleo y pagos</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="font-medium text-muted-foreground">
              Salario Mensual:
            </span>
            <span className="text-foreground font-semibold">
              S/ {user.profile.salaryMonth}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-medium text-muted-foreground">
                Fecha de Pago:
              </span>
            </div>
            <span className="text-foreground">
              {user.profile.paymentDate
                ? format(
                    new Date(user.profile.paymentDate),
                    "dd 'de' MMMM, yyyy",
                    { locale: es }
                  )
                : "No definida"}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="font-medium text-muted-foreground">
              Fecha de Registro:
            </span>
            <span className="text-foreground">
              {format(new Date(user.createdAt), "dd 'de' MMMM, yyyy", {
                locale: es,
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
