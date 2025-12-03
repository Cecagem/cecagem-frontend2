"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, User, Users, Plus, AlertTriangle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { SearchableSelect, MultiSelect } from "@/components/shared";
import type { SearchableSelectOption, MultiSelectOption } from "@/components/shared";

import { useDebounce } from "@/hooks/use-debounce";
import { useServices, useServiceById } from "@/features/engagements/hooks/useEngagements";
import { useUsers, useUser } from "@/features/user/hooks/use-users";
import { useResearchClients, useResearchClient } from "@/features/research-clients/hooks/use-research-clients";
import { UserRole } from "@/features/user/types/user.types";
import { UserForm } from "@/features/user/components/UserForm";
import { ResearchClientForm } from "@/features/research-clients/components/ResearchClientForm";
import type { ServiceResponse } from "@/features/engagements/types/engagements.type";
import type { EditRestrictions } from "./NewContractForm";

// Helper para extraer servicio de la respuesta (la API puede retornar {data: Service} o Service directamente)
const getServiceFromResponse = (response: ServiceResponse | null | undefined): { id: string; name: string } | null => {
  if (!response) return null;
  // Si tiene 'data' como wrapper, extraerlo
  if ('data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
    return response.data;
  }
  // La API retorna el servicio directamente (sin wrapper)
  if ('id' in response && 'name' in response) {
    return response as unknown as { id: string; name: string };
  }
  return null;
};

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
  editRestrictions?: EditRestrictions;
}

export const ContractFormStep1 = ({ initialData, onNext, editRestrictions }: ContractFormStep1Props) => {
  // Estados para búsqueda con debounce
  const [searchCollaborator, setSearchCollaborator] = useState("");
  const [searchClient, setSearchClient] = useState("");
  const [searchService, setSearchService] = useState("");
  
  // Aplicar debounce a las búsquedas
  const debouncedCollaboratorSearch = useDebounce(searchCollaborator, 300);
  const debouncedClientSearch = useDebounce(searchClient, 300);
  const debouncedServiceSearch = useDebounce(searchService, 300);
  
  // Estados para guardar las opciones seleccionadas (para mantenerlas al buscar y al volver de otros pasos)
  const [selectedServiceOption, setSelectedServiceOption] = useState<SearchableSelectOption | null>(null);
  const [selectedCollaboratorOption, setSelectedCollaboratorOption] = useState<SearchableSelectOption | null>(null);
  const [selectedClientOptions, setSelectedClientOptions] = useState<MultiSelectOption[]>([]);
  
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

  // Queries para obtener datos de items seleccionados (cuando se vuelve de otro paso)
  const { data: selectedServiceData } = useServiceById(initialData?.serviceId || "");
  const { data: selectedCollaboratorData } = useUser(initialData?.collaboratorId || "");
  
  // Para clientes, usamos el primer ID para obtener datos (simplificado)
  const firstClientId = initialData?.researchClientIds?.[0] || "";
  const { data: selectedClient1Data } = useResearchClient(firstClientId);
  const secondClientId = initialData?.researchClientIds?.[1] || "";
  const { data: selectedClient2Data } = useResearchClient(secondClientId);
  const thirdClientId = initialData?.researchClientIds?.[2] || "";
  const { data: selectedClient3Data } = useResearchClient(thirdClientId);

  // Calcular opciones seleccionadas directamente desde los datos de la API
  const computedServiceOption: SearchableSelectOption | null = useMemo(() => {
    if (selectedServiceOption) return selectedServiceOption;
    const service = getServiceFromResponse(selectedServiceData);
    if (service) {
      return {
        value: service.id,
        label: service.name,
      };
    }
    return null;
  }, [selectedServiceOption, selectedServiceData]);

  const computedCollaboratorOption: SearchableSelectOption | null = useMemo(() => {
    if (selectedCollaboratorOption) return selectedCollaboratorOption;
    if (selectedCollaboratorData) {
      return {
        value: selectedCollaboratorData.id,
        label: `${selectedCollaboratorData.profile.documentNumber} - ${selectedCollaboratorData.profile.firstName} ${selectedCollaboratorData.profile.lastName}`,
      };
    }
    return null;
  }, [selectedCollaboratorOption, selectedCollaboratorData]);

  const computedClientOptions: MultiSelectOption[] = useMemo(() => {
    if (selectedClientOptions.length > 0) return selectedClientOptions;
    
    const clients: MultiSelectOption[] = [];
    if (selectedClient1Data) {
      clients.push({
        value: selectedClient1Data.id,
        label: `${selectedClient1Data.profile.documentNumber} - ${selectedClient1Data.profile.firstName} ${selectedClient1Data.profile.lastName}`,
      });
    }
    if (selectedClient2Data) {
      clients.push({
        value: selectedClient2Data.id,
        label: `${selectedClient2Data.profile.documentNumber} - ${selectedClient2Data.profile.firstName} ${selectedClient2Data.profile.lastName}`,
      });
    }
    if (selectedClient3Data) {
      clients.push({
        value: selectedClient3Data.id,
        label: `${selectedClient3Data.profile.documentNumber} - ${selectedClient3Data.profile.firstName} ${selectedClient3Data.profile.lastName}`,
      });
    }
    return clients;
  }, [selectedClientOptions, selectedClient1Data, selectedClient2Data, selectedClient3Data]);

  // Obtener servicios activos con búsqueda
  const { data: servicesData, isLoading: isLoadingServices } = useServices({ 
    isActive: true, 
    limit: 10,
    search: debouncedServiceSearch.length >= 2 ? debouncedServiceSearch : undefined,
  });

  // Obtener todos los usuarios activos del sistema con búsqueda
  const { data: usersData, refetch: refetchUsers, isLoading: isLoadingUsers } = useUsers({
    search: debouncedCollaboratorSearch.length >= 2 ? debouncedCollaboratorSearch : undefined,
    isActive: true,
    limit: 10,
  });

  // Filtrar colaboradores internos y externos manualmente
  const collaborators = useMemo(() => 
    usersData?.data?.filter(user => 
      user.role === UserRole.COLLABORATOR_INTERNAL || 
      user.role === UserRole.COLLABORATOR_EXTERNAL
    ) || [],
    [usersData?.data]
  );

  // Obtener clientes de investigación con búsqueda
  const { data: researchClientsData, refetch: refetchClients, isLoading: isLoadingClients } = useResearchClients({
    limit: 10,
    search: debouncedClientSearch.length >= 2 ? debouncedClientSearch : undefined,
  });
  
  // Opciones de servicios de la API
  const apiServiceOptions: SearchableSelectOption[] = useMemo(() => 
    servicesData?.data?.map(service => ({
      value: service.id,
      label: service.name,
    })) || [], 
    [servicesData?.data]
  );

  // Combinar servicio seleccionado con las opciones de la API
  const serviceOptions: SearchableSelectOption[] = useMemo(() => {
    const combinedMap = new Map<string, SearchableSelectOption>();
    
    // Agregar el seleccionado primero
    if (computedServiceOption) {
      combinedMap.set(computedServiceOption.value, computedServiceOption);
    }
    
    // Luego agregar las de la API
    apiServiceOptions.forEach(opt => {
      if (!combinedMap.has(opt.value)) {
        combinedMap.set(opt.value, opt);
      }
    });
    
    return Array.from(combinedMap.values());
  }, [computedServiceOption, apiServiceOptions]);

  // Opciones de colaboradores de la API
  const apiCollaboratorOptions: SearchableSelectOption[] = useMemo(() => 
    collaborators.map(user => ({
      value: user.id,
      label: `${user.profile.documentNumber} - ${user.profile.firstName} ${user.profile.lastName}`,
    })),
    [collaborators]
  );

  // Combinar colaborador seleccionado con las opciones de la API
  const collaboratorOptions: SearchableSelectOption[] = useMemo(() => {
    const combinedMap = new Map<string, SearchableSelectOption>();
    
    // Agregar el seleccionado primero
    if (computedCollaboratorOption) {
      combinedMap.set(computedCollaboratorOption.value, computedCollaboratorOption);
    }
    
    // Luego agregar las de la API
    apiCollaboratorOptions.forEach(opt => {
      if (!combinedMap.has(opt.value)) {
        combinedMap.set(opt.value, opt);
      }
    });
    
    return Array.from(combinedMap.values());
  }, [computedCollaboratorOption, apiCollaboratorOptions]);

  // Opciones de clientes de la API
  const apiClientOptions: MultiSelectOption[] = useMemo(() => 
    researchClientsData?.data?.map(client => ({
      value: client.id,
      label: `${client.profile.documentNumber} - ${client.profile.firstName} ${client.profile.lastName}`,
    })) || [],
    [researchClientsData?.data]
  );

  // Combinar opciones seleccionadas con las de la API (sin duplicados)
  const researchClientOptions: MultiSelectOption[] = useMemo(() => {
    const combinedMap = new Map<string, MultiSelectOption>();
    
    // Primero agregar las seleccionadas (tienen prioridad) - usar computed
    computedClientOptions.forEach(opt => combinedMap.set(opt.value, opt));
    
    // Luego agregar las de la API
    apiClientOptions.forEach(opt => {
      if (!combinedMap.has(opt.value)) {
        combinedMap.set(opt.value, opt);
      }
    });
    
    return Array.from(combinedMap.values());
  }, [computedClientOptions, apiClientOptions]);

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
          
          {/* Alertas de restricciones de edición */}
          {editRestrictions && (!editRestrictions.canChangeService || !editRestrictions.canChangeCollaborator) && (
            <Alert variant="default" className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong>Campos con restricciones:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {!editRestrictions.canChangeService && (
                    <li>
                      <strong>🔒 Servicio bloqueado:</strong> Hay entregables completados o aprobados. 
                      No se puede cambiar a otro servicio.
                    </li>
                  )}
                  {!editRestrictions.canChangeCollaborator && (
                    <li>
                      <strong>🔒 Colaborador bloqueado:</strong> El colaborador actual tiene pagos completados. 
                      No se puede cambiar a otro colaborador.
                    </li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}

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
                    <FormLabel className="flex items-center gap-2">
                      Servicio *
                      {editRestrictions && !editRestrictions.canChangeService && (
                        <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                          🔒 Bloqueado
                        </Badge>
                      )}
                    </FormLabel>
                    <FormControl>
                      <SearchableSelect
                        options={serviceOptions}
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Guardar la opción seleccionada
                          const selected = serviceOptions.find(opt => opt.value === value);
                          if (selected) setSelectedServiceOption(selected);
                        }}
                        placeholder="Seleccionar servicio..."
                        searchPlaceholder="Buscar servicio..."
                        emptyMessage="No se encontraron servicios"
                        onSearchChange={setSearchService}
                        isLoading={isLoadingServices}
                        selectedOption={computedServiceOption}
                        disabled={editRestrictions && !editRestrictions.canChangeService}
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
          <Card className={editRestrictions && !editRestrictions.canChangeCollaborator ? "opacity-75" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Colaborador Responsable
                  {editRestrictions && !editRestrictions.canChangeCollaborator && (
                    <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                      🔒 Bloqueado
                    </Badge>
                  )}
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUserForm(true)}
                  className="flex items-center gap-2"
                  disabled={editRestrictions && !editRestrictions.canChangeCollaborator}
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
                    <FormLabel className="flex items-center gap-2">
                      Colaborador *
                      {editRestrictions && !editRestrictions.canChangeCollaborator && (
                        <span className="text-xs text-amber-600">(No modificable)</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <SearchableSelect
                        options={collaboratorOptions}
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Guardar la opción seleccionada
                          const selected = collaboratorOptions.find(opt => opt.value === value);
                          if (selected) setSelectedCollaboratorOption(selected);
                        }}
                        placeholder="Seleccionar colaborador..."
                        searchPlaceholder="Buscar por nombre o DNI..."
                        emptyMessage="No se encontraron colaboradores"
                        onSearchChange={setSearchCollaborator}
                        isLoading={isLoadingUsers}
                        selectedOption={computedCollaboratorOption}
                        disabled={editRestrictions && !editRestrictions.canChangeCollaborator}
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
                        options={researchClientOptions}
                        value={field.value}
                        onValueChange={(newValues) => {
                          field.onChange(newValues);
                          // Guardar las opciones seleccionadas para mantenerlas al buscar
                          const newSelectedOptions = researchClientOptions.filter(
                            opt => newValues.includes(opt.value)
                          );
                          setSelectedClientOptions(newSelectedOptions);
                        }}
                        placeholder="Seleccionar clientes..."
                        searchPlaceholder="Buscar por nombre o DNI..."
                        emptyMessage="No se encontraron clientes"
                        maxSelections={3}
                        onSearchChange={setSearchClient}
                        isLoading={isLoadingClients}
                        selectedOptions={computedClientOptions}
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