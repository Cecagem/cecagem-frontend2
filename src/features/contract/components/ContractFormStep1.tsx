"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, User, Users, Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SearchableSelect, MultiSelect } from "@/components/shared";
import type { SearchableSelectOption, MultiSelectOption } from "@/components/shared";

import { useServices } from "@/features/engagements/hooks/useEngagements";
import { useUsers } from "@/features/user/hooks/use-users";
import { useResearchClients } from "@/features/research-clients/hooks/use-research-clients";
import { UserRole } from "@/features/user/types/user.types";
import { UserForm } from "@/features/user/components/UserForm";
import { ResearchClientForm } from "@/features/research-clients/components/ResearchClientForm";

// Schema de validación para el paso 1
const step1Schema = z.object({
  serviceId: z.string().min(1, "Debe seleccionar un servicio"),
  name: z.string().min(1, "El nombre del contrato es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(200, "El nombre no puede exceder 200 caracteres"),
  university: z.string().min(1, "La universidad es obligatoria")
    .min(3, "La universidad debe tener al menos 3 caracteres"),
  career: z.string().min(1, "La carrera es obligatoria")
    .min(3, "La carrera debe tener al menos 3 caracteres"),
  observation: z.string().optional(),
  collaboratorId: z.string().min(1, "Debe seleccionar un colaborador"),
  researchClientIds: z.array(z.string()).min(1, "Debe seleccionar al menos un cliente").max(3, "Máximo 3 clientes permitidos"),
});

export type Step1FormData = z.infer<typeof step1Schema>;

interface ContractFormStep1Props {
  initialData?: Partial<Step1FormData>;
  onNext: (data: Step1FormData) => void;
}

export const ContractFormStep1 = ({ initialData, onNext }: ContractFormStep1Props) => {
  const [searchCollaborators] = useState("");
  
  // Estados para modales de creación
  const [showUserForm, setShowUserForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);

  const form = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      serviceId: initialData?.serviceId || "",
      name: initialData?.name || "",
      university: initialData?.university || "",
      career: initialData?.career || "",
      observation: initialData?.observation || "",
      collaboratorId: initialData?.collaboratorId || "",
      researchClientIds: initialData?.researchClientIds || [],
    },
  });

  // Obtener servicios activos
  const { data: servicesData } = useServices({ isActive: true, limit: 100 });

  // Obtener todos los usuarios activos del sistema
  const { data: usersData, refetch: refetchUsers } = useUsers({
    search: searchCollaborators.length >= 2 ? searchCollaborators : undefined,
    isActive: true,
    limit: 100,
  });

  // Filtrar colaboradores internos y externos manualmente
  const collaborators = usersData?.data?.filter(user => 
    user.role === UserRole.COLLABORATOR_INTERNAL || 
    user.role === UserRole.COLLABORATOR_EXTERNAL
  ) || [];

  // Obtener clientes de investigación (TODOS, no solo activos)
  const { data: researchClientsData, refetch: refetchClients } = useResearchClients({
    limit: 100,
  });
  
  // Convertir datos a opciones de select
  const serviceOptions: SearchableSelectOption[] = servicesData?.data?.map(service => ({
    value: service.id,
    label: service.name,
  })) || [];

  const collaboratorOptions: SearchableSelectOption[] = collaborators.map(user => ({
    value: user.id,
    label: `${user.profile.documentNumber} - ${user.profile.firstName} ${user.profile.lastName}`,
  }));

  const researchClientOptions: MultiSelectOption[] = researchClientsData?.data?.map(client => ({
    value: client.id,
    label: `${client.profile.documentNumber} - ${client.profile.firstName} ${client.profile.lastName}`,
  })) || [];

  const handleSubmit = (data: Step1FormData) => {
    onNext(data);
  };

  // Handlers para creación de colaboradores y clientes
  const handleUserCreated = async () => {
    setShowUserForm(false);
    // Solo refrescar la lista de usuarios
    await refetchUsers();
  };

  const handleClientCreated = async () => {
    setShowClientForm(false);
    // Solo refrescar la lista de clientes
    await refetchClients();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Información Básica del Contrato</h2>
        <p className="text-muted-foreground">
          Complete la información general del contrato y seleccione los participantes
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          
          {/* Información del Contrato */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información del Contrato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="serviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Servicio *</FormLabel>
                    <FormControl>
                      <SearchableSelect
                        options={serviceOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Seleccionar servicio..."
                        searchPlaceholder="Buscar servicio..."
                        emptyMessage="No se encontraron servicios"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Contrato *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Tesis de Ingeniería de Sistemas - UNI" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="university"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Universidad *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Universidad Nacional de Ingeniería" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="career"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carrera *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Ingeniería de Sistemas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="observation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observaciones</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Observaciones adicionales sobre el contrato..." 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Colaborador */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Colaborador Responsable
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUserForm(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Añadir Nuevo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="collaboratorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colaborador *</FormLabel>
                    <FormControl>
                      <SearchableSelect
                        key={`collaborators-${collaborators.length}`}
                        options={collaboratorOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Seleccionar colaborador..."
                        searchPlaceholder="Buscar por nombre o DNI..."
                        emptyMessage="No se encontraron colaboradores"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Clientes de Investigación */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Clientes de Investigación
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowClientForm(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Añadir Nuevo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="researchClientIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clientes *</FormLabel>
                    <FormControl>
                      <MultiSelect
                        key={`clients-${researchClientsData?.data?.length || 0}`}
                        options={researchClientOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Seleccionar clientes..."
                        searchPlaceholder="Buscar por nombre o DNI..."
                        emptyMessage="No se encontraron clientes"
                        maxSelections={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Botón Siguiente */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Siguiente: Entregables
            </button>
          </div>
        </form>
      </Form>

      {/* Modal para crear colaborador */}
      <UserForm
        open={showUserForm}
        onOpenChange={setShowUserForm}
        onUserSaved={handleUserCreated}
        mode="create"
      />

      {/* Modal para crear cliente de investigación */}
      <ResearchClientForm
        open={showClientForm}
        onOpenChange={setShowClientForm}
        onClientSaved={handleClientCreated}
        mode="create"
      />
    </div>
  );
};