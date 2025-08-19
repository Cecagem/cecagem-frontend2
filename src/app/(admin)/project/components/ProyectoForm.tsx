"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Trash2,
  CalendarIcon,
  DollarSign,
  FileText,
  ChevronsUpDown
} from "lucide-react";
import {
  Proyecto,
  ProyectoFormData,
  TipoProyecto,
  EstadoProyecto,
  TipoPago,
  Moneda,
  EntregablesPredefinidos,
  Entregable,
  proyectoFormSchema,
  tipoProyectoLabels,
  estadoProyectoLabels,
  entregablesLabels,
  ClienteOption,
  ColaboradorOption,
} from "../types";

interface ProyectoFormProps {
  proyecto?: Proyecto | null;
  onSubmit: (proyecto: Proyecto) => void;
  onCancel: () => void;
}

// Datos de ejemplo para clientes y colaboradores
const clientesEjemplo: ClienteOption[] = [
  { id: "client-1", label: "UNMSM - Universidad Nacional Mayor de San Marcos", tipo: "investigacion" },
  { id: "client-2", label: "Instituto Tecnológico San Juan", tipo: "contable" },
  { id: "client-3", label: "Empresa Constructora ABC S.A.C.", tipo: "contable" },
  { id: "client-4", label: "UNI - Universidad Nacional de Ingeniería", tipo: "investigacion" },
];

const colaboradoresEjemplo: ColaboradorOption[] = [
  { id: "colab-1", label: "Juan Pérez", especialidad: "Metodología de Investigación" },
  { id: "colab-2", label: "Ana García", especialidad: "Desarrollo de Software" },
  { id: "colab-3", label: "Carlos López", especialidad: "Consultoría Financiera" },
  { id: "colab-4", label: "María Rodríguez", especialidad: "Análisis Estadístico" },
];

const pasos = [
  {
    id: 1,
    title: "Información Básica",
    description: "Datos generales del proyecto",
    icon: FileText,
  },
  {
    id: 2,
    title: "Información de Pago",
    description: "Condiciones económicas",
    icon: DollarSign,
  },
  {
    id: 3,
    title: "Entregables",
    description: "Productos y fechas de entrega",
    icon: CalendarIcon,
  },
];

// Componente para el selector de entregables con buscador
interface EntregableComboboxProps {
  onSelect: (tipo: EntregablesPredefinidos) => void;
  onAddCustom: (nombre: string) => void;
  selectedEntregables: Entregable[];
}

function EntregableCombobox({ onSelect, onAddCustom, selectedEntregables }: EntregableComboboxProps) {
  const [search, setSearch] = useState("");

  const entregablesPredefinidos = Object.entries(entregablesLabels);
  
  const filteredEntregables = entregablesPredefinidos.filter(([value, label]) =>
    label.toLowerCase().includes(search.toLowerCase()) &&
    !selectedEntregables.some(e => e.esPredefinido && e.tipoPredefinido === value)
  );

  const handleSelect = (value: string) => {
    if (value.startsWith("custom-")) {
      // Es un entregable personalizado
      onAddCustom(search);
    } else {
      // Es un entregable predefinido
      onSelect(value as EntregablesPredefinidos);
    }
    setSearch("");
  };

  return (
    <Command>
      <CommandInput 
        placeholder="Buscar entregable..." 
        value={search}
        onValueChange={setSearch}
        className="h-9"
      />
      <CommandList>
        <CommandEmpty>
          <div className="text-center p-4">
            <p className="text-sm text-muted-foreground mb-2">
              No se encontró &quot;{search}&quot;
            </p>
            {search.trim() && (
              <Button
                size="sm"
                onClick={() => {
                  onAddCustom(search);
                  setSearch("");
                }}
                className="text-xs"
              >
                <Check className="mr-2 h-3 w-3" />
                Agregar &quot;{search}&quot; como personalizado
              </Button>
            )}
          </div>
        </CommandEmpty>
        
        <CommandGroup heading="Entregables Predefinidos">
          {filteredEntregables.map(([value, label]) => (
            <CommandItem
              key={value}
              value={label}
              onSelect={() => handleSelect(value)}
              className="cursor-pointer"
            >
              <Check className="mr-2 h-4 w-4 opacity-0" />
              <div className="flex flex-col">
                <span className="font-medium text-sm">{label}</span>
                <span className="text-xs text-muted-foreground">Predefinido</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
        
        {search.trim() && (
          <CommandGroup heading="Agregar Personalizado">
            <CommandItem
              value={`custom-${search}`}
              onSelect={() => {
                onAddCustom(search);
                setSearch("");
              }}
              className="cursor-pointer"
            >
              <Check className="mr-2 h-4 w-4 opacity-0" />
              <div className="flex flex-col">
                <span className="font-medium text-sm">&quot;{search}&quot;</span>
                <span className="text-xs text-muted-foreground">Agregar como personalizado</span>
              </div>
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
}

export function ProyectoForm({ proyecto, onSubmit, onCancel }: ProyectoFormProps) {
  const [pasoActual, setPasoActual] = useState(1);
  const [entregablesCustomizados, setEntregablesCustomizados] = useState<Entregable[]>([]);

  // Estados para los combobox
  const [openClienteCombo, setOpenClienteCombo] = useState(false);
  const [openColaboradorCombo, setOpenColaboradorCombo] = useState(false);
  const [searchCliente, setSearchCliente] = useState("");
  const [searchColaborador, setSearchColaborador] = useState("");

  // Estado para las cuotas individuales
  const [cuotasIndividuales, setCuotasIndividuales] = useState<Array<{
    numero: number;
    monto: number;
    fechaVencimiento: Date;
  }>>([]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<ProyectoFormData>({
    resolver: zodResolver(proyectoFormSchema),
    defaultValues: {
      titulo: proyecto?.titulo || "",
      tipoProyecto: proyecto?.tipoProyecto,
      descripcion: proyecto?.descripcion || "",
      clienteIds: proyecto?.clienteIds || [],
      colaboradorId: proyecto?.colaboradorId || "",
      fechaInicio: proyecto?.fechaInicio,
      fechaFin: proyecto?.fechaFin,
      estado: proyecto?.estado,
      tipoPago: proyecto?.datoPago?.tipoPago,
      moneda: proyecto?.datoPago?.moneda,
      montoTotal: proyecto?.datoPago?.montoTotal?.toString() || "",
      numeroCuotas: proyecto?.datoPago?.numeroCuotas?.toString() || "",
      montoCuota: proyecto?.datoPago?.montoCuota?.toString() || "",
      entregables: proyecto?.entregables || [],
    },
  });

  const watchTipoPago = watch("tipoPago");
  const watchClienteIds = watch("clienteIds");
  const watchColaboradorId = watch("colaboradorId");
  const watchMontoTotal = watch("montoTotal");
  const watchNumeroCuotas = watch("numeroCuotas");
  const watchMoneda = watch("moneda");

  // Función para generar cuotas automáticamente
  const generarCuotasAutomaticas = (montoTotal: string, numeroCuotas: string) => {
    const monto = parseFloat(montoTotal);
    const numCuotas = parseInt(numeroCuotas);
    
    if (isNaN(monto) || isNaN(numCuotas) || monto <= 0 || numCuotas <= 0) {
      setCuotasIndividuales([]);
      return;
    }

    const montoPorCuota = monto / numCuotas;
    const fechaBase = new Date();
    
    const nuevasCuotas = Array.from({ length: numCuotas }, (_, index) => {
      const fechaVencimiento = new Date(fechaBase);
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + index + 1);
      
      return {
        numero: index + 1,
        monto: montoPorCuota,
        fechaVencimiento
      };
    });
    
    setCuotasIndividuales(nuevasCuotas);
  };

  // Efecto para generar cuotas cuando cambian monto total o número de cuotas
  useEffect(() => {
    if (watchTipoPago === TipoPago.CUOTAS && watchMontoTotal && watchNumeroCuotas) {
      generarCuotasAutomaticas(watchMontoTotal, watchNumeroCuotas);
    } else {
      setCuotasIndividuales([]);
    }
  }, [watchTipoPago, watchMontoTotal, watchNumeroCuotas]);

  // Función para actualizar fecha de una cuota específica
  const actualizarFechaCuota = (index: number, nuevaFecha: Date) => {
    const cuotasActualizadas = [...cuotasIndividuales];
    cuotasActualizadas[index].fechaVencimiento = nuevaFecha;
    setCuotasIndividuales(cuotasActualizadas);
  };

  useEffect(() => {
    if (proyecto?.entregables) {
      // Para proyectos existentes, mantener las fechas de entrega originales
      setEntregablesCustomizados(proyecto.entregables);
    }
    
    // Inicializar cuotas si el proyecto tiene pago en cuotas
    if (proyecto?.datoPago?.tipoPago === TipoPago.CUOTAS && 
        proyecto?.datoPago?.numeroCuotas && 
        proyecto?.datoPago?.montoTotal) {
      
      const numCuotas = proyecto.datoPago.numeroCuotas;
      const montoTotal = proyecto.datoPago.montoTotal;
      const montoPorCuota = montoTotal / numCuotas;
      
      // Si hay fechas de pago guardadas, usarlas. Si no, generar fechas mensuales
      const fechasPago = proyecto.datoPago.fechasPago || [];
      const fechaBase = new Date();
      
      const cuotasIniciales = Array.from({ length: numCuotas }, (_, index) => {
        let fechaVencimiento: Date;
        
        if (fechasPago[index]) {
          fechaVencimiento = new Date(fechasPago[index]);
        } else {
          fechaVencimiento = new Date(fechaBase);
          fechaVencimiento.setMonth(fechaVencimiento.getMonth() + index + 1);
        }
        
        return {
          numero: index + 1,
          monto: montoPorCuota,
          fechaVencimiento
        };
      });
      
      setCuotasIndividuales(cuotasIniciales);
    }
  }, [proyecto]);

  const handlePasoSiguiente = async () => {
    let camposValidar: (keyof ProyectoFormData)[] = [];
    
    switch (pasoActual) {
      case 1:
        camposValidar = ["titulo", "tipoProyecto", "descripcion", "clienteIds", "colaboradorId", "fechaInicio", "fechaFin", "estado"];
        break;
      case 2:
        camposValidar = ["tipoPago", "moneda", "montoTotal"];
        if (watchTipoPago === TipoPago.CUOTAS) {
          camposValidar.push("numeroCuotas");
          // Validar que se hayan generado las cuotas
          if (cuotasIndividuales.length === 0) {
            return; // No continuar si no hay cuotas generadas
          }
        }
        break;
    }

    const isStepValid = await trigger(camposValidar);
    
    if (isStepValid && pasoActual < 3) {
      setPasoActual(pasoActual + 1);
    }
  };

  const handlePasoAnterior = () => {
    if (pasoActual > 1) {
      setPasoActual(pasoActual - 1);
    }
  };

  const handleAgregarEntregable = (nombre?: string) => {
    const nuevoEntregable: Entregable = {
      id: `custom-${Date.now()}`,
      nombre: nombre || "",
      descripcion: "",
      fechaEntrega: new Date(),
      completado: false,
      esPredefinido: false,
    };
    const nuevosEntregables = [...entregablesCustomizados, nuevoEntregable];
    setEntregablesCustomizados(nuevosEntregables);
    setValue("entregables", nuevosEntregables);
  };

  const handleEliminarEntregable = (index: number) => {
    const nuevosEntregables = entregablesCustomizados.filter((_, i) => i !== index);
    setEntregablesCustomizados(nuevosEntregables);
    setValue("entregables", nuevosEntregables);
  };

  const handleAgregarEntregablePredefinido = (tipo: EntregablesPredefinidos) => {
    const entregableExiste = entregablesCustomizados.some(
      e => e.esPredefinido && e.tipoPredefinido === tipo
    );
    
    if (!entregableExiste) {
      const nuevoEntregable: Entregable = {
        id: `predefined-${tipo}-${Date.now()}`,
        nombre: entregablesLabels[tipo],
        fechaEntrega: new Date(),
        completado: false,
        esPredefinido: true,
        tipoPredefinido: tipo,
      };
      const nuevosEntregables = [...entregablesCustomizados, nuevoEntregable];
      setEntregablesCustomizados(nuevosEntregables);
      setValue("entregables", nuevosEntregables);
    }
  };

  const handleClienteToggle = (clienteId: string) => {
    const clientesActuales = watchClienteIds || [];
    const nuevosClientes = clientesActuales.includes(clienteId)
      ? clientesActuales.filter(id => id !== clienteId)
      : [...clientesActuales, clienteId];
    setValue("clienteIds", nuevosClientes);
  };

  const onFormSubmit = (data: ProyectoFormData) => {
    // Preparar entregables con fechas de entrega automáticas si no tienen
    const entregablesConFechas = entregablesCustomizados.map((entregable) => {
      if (!entregable.fechaEntrega) {
        // Si no tiene fecha de entrega, asignar fecha de finalización del proyecto
        const fechaEntrega = data.fechaFin || new Date();
        return { ...entregable, fechaEntrega };
      }
      return entregable;
    });

    const proyectoData: Proyecto = {
      id: proyecto?.id || crypto.randomUUID(),
      titulo: data.titulo,
      tipoProyecto: data.tipoProyecto || TipoProyecto.OTRO,
      descripcion: data.descripcion || "",
      clienteIds: data.clienteIds,
      colaboradorId: data.colaboradorId,
      fechaInicio: data.fechaInicio || new Date(),
      fechaFin: data.fechaFin || new Date(),
      estado: data.estado || EstadoProyecto.PLANIFICACION,
      datoPago: {
        tipoPago: data.tipoPago || TipoPago.CONTADO,
        moneda: data.moneda || Moneda.SOLES,
        montoTotal: data.montoTotal ? parseFloat(data.montoTotal) : 0,
        numeroCuotas: data.tipoPago === TipoPago.CUOTAS ? parseInt(data.numeroCuotas || '1') : undefined,
        montoCuota: data.tipoPago === TipoPago.CUOTAS && cuotasIndividuales.length > 0 
          ? cuotasIndividuales[0].monto 
          : undefined,
        fechasPago: data.tipoPago === TipoPago.CUOTAS 
          ? cuotasIndividuales.map(cuota => cuota.fechaVencimiento) 
          : undefined,
      },
      entregables: entregablesConFechas,
      fechaCreacion: proyecto?.fechaCreacion || new Date(),
      fechaModificacion: new Date(),
      creadoPor: proyecto?.creadoPor || "usuario-actual",
    };

    onSubmit(proyectoData);
  };

  const renderPaso1 = () => (
    <div className="space-y-6 sm:space-y-8">
      {/* Sección: Información Básica */}
      <div className="space-y-4 sm:space-y-6">
        <h3 className="text-base sm:text-lg font-semibold text-foreground border-b pb-2">Información Básica</h3>
        
        {/* Título - Ancho completo */}
        <div>
          <Label htmlFor="titulo" className="text-sm font-medium">Título del Proyecto *</Label>
          <Controller
            name="titulo"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="titulo"
                placeholder="Ingrese el título del proyecto"
                className={cn("mt-1.5", errors.titulo ? "border-red-500" : "")}
              />
            )}
          />
          {errors.titulo && (
            <p className="text-sm text-red-500 mt-1">{errors.titulo.message}</p>
          )}
        </div>

        {/* Fila: Tipo y Estado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <Label htmlFor="tipoProyecto" className="text-sm font-medium">Tipo de Proyecto *</Label>
            <Controller
              name="tipoProyecto"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={cn("mt-1.5", errors.tipoProyecto ? "border-red-500" : "")}>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(tipoProyectoLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tipoProyecto && (
              <p className="text-sm text-red-500 mt-1">{errors.tipoProyecto.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="estado" className="text-sm font-medium">Estado *</Label>
            <Controller
              name="estado"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={cn("mt-1.5", errors.estado ? "border-red-500" : "")}>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(estadoProyectoLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.estado && (
              <p className="text-sm text-red-500 mt-1">{errors.estado.message}</p>
            )}
          </div>
        </div>

        {/* Fila: Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <Label htmlFor="fechaInicio" className="text-sm font-medium">Fecha de Inicio *</Label>
            <Controller
              name="fechaInicio"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1.5",
                        !field.value && "text-muted-foreground",
                        errors.fechaInicio && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP", { locale: es }) : "Seleccionar fecha de inicio"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.fechaInicio && (
              <p className="text-sm text-red-500 mt-1">{errors.fechaInicio.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="fechaFin" className="text-sm font-medium">Fecha de Finalización *</Label>
            <Controller
              name="fechaFin"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1.5",
                        !field.value && "text-muted-foreground",
                        errors.fechaFin && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP", { locale: es }) : "Seleccionar fecha de finalización"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date("1900-01-01")
                      }
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.fechaFin && (
              <p className="text-sm text-red-500 mt-1">{errors.fechaFin.message}</p>
            )}
          </div>
        </div>

        {/* Descripción */}
        <div>
          <Label htmlFor="descripcion" className="text-sm font-medium">Descripción *</Label>
          <Controller
            name="descripcion"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                id="descripcion"
                placeholder="Describa el proyecto en detalle, objetivos, alcance y metodología"
                rows={4}
                className={cn("mt-1.5", errors.descripcion ? "border-red-500" : "")}
              />
            )}
          />
          {errors.descripcion && (
            <p className="text-sm text-red-500 mt-1">{errors.descripcion.message}</p>
          )}
        </div>
      </div>

      {/* Sección: Asignaciones */}
      <div className="space-y-4 sm:space-y-6">
        <h3 className="text-base sm:text-lg font-semibold text-foreground border-b pb-2">Asignaciones del Proyecto</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Clientes */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Clientes * (Puede seleccionar varios)</Label>
            <Popover open={openClienteCombo} onOpenChange={setOpenClienteCombo}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openClienteCombo}
                  className={cn(
                    "w-full justify-between h-auto min-h-[40px] py-2",
                    errors.clienteIds && "border-red-500"
                  )}
                >
                  <span className="text-left">
                    {watchClienteIds && watchClienteIds.length > 0 
                      ? `${watchClienteIds.length} cliente(s) seleccionado(s)`
                      : "Seleccionar clientes..."
                    }
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] max-w-[calc(100vw-2rem)] p-0">
                <Command>
                  <CommandInput 
                    placeholder="Buscar cliente..." 
                    value={searchCliente}
                    onValueChange={setSearchCliente}
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No se encontraron clientes.</CommandEmpty>
                    <CommandGroup>
                      {clientesEjemplo
                        .filter((cliente) => 
                          cliente.label.toLowerCase().includes(searchCliente.toLowerCase())
                        )
                        .map((cliente) => (
                        <CommandItem
                          key={cliente.id}
                          value={cliente.label}
                          onSelect={() => handleClienteToggle(cliente.id)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center space-x-3 w-full py-1">
                            <Checkbox
                              checked={watchClienteIds?.includes(cliente.id) || false}
                              onCheckedChange={() => handleClienteToggle(cliente.id)}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{cliente.label}</div>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {cliente.tipo}
                              </Badge>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            
            {/* Mostrar clientes seleccionados */}
            {watchClienteIds && watchClienteIds.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-md border max-w-full">
                {watchClienteIds.map((clienteId) => {
                  const cliente = clientesEjemplo.find(c => c.id === clienteId);
                  return cliente ? (
                    <Badge key={clienteId} variant="secondary" className="flex items-center gap-1 px-2 py-1 max-w-full">
                      <span className="max-w-[150px] sm:max-w-[200px] truncate text-xs sm:text-sm">{cliente.label}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent text-muted-foreground hover:text-foreground ml-1"
                        onClick={() => handleClienteToggle(clienteId)}
                      >
                        ×
                      </Button>
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
            
            {errors.clienteIds && (
              <p className="text-sm text-red-500">{errors.clienteIds.message}</p>
            )}
          </div>

          {/* Colaborador */}
          <div className="space-y-3">
            <Label htmlFor="colaboradorId" className="text-sm font-medium">Colaborador Responsable *</Label>
            <Controller
              name="colaboradorId"
              control={control}
              render={({ field }) => (
                <Popover open={openColaboradorCombo} onOpenChange={setOpenColaboradorCombo}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openColaboradorCombo}
                      className={cn(
                        "w-full justify-between h-auto min-h-[40px] py-2",
                        errors.colaboradorId && "border-red-500"
                      )}
                    >
                      <span className="text-left">
                        {field.value
                          ? colaboradoresEjemplo.find((colaborador) => colaborador.id === field.value)?.label
                          : "Seleccionar colaborador responsable..."
                        }
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput 
                        placeholder="Buscar colaborador..." 
                        value={searchColaborador}
                        onValueChange={setSearchColaborador}
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No se encontraron colaboradores.</CommandEmpty>
                        <CommandGroup>
                          {colaboradoresEjemplo
                            .filter((colaborador) => 
                              colaborador.label.toLowerCase().includes(searchColaborador.toLowerCase()) ||
                              (colaborador.especialidad && colaborador.especialidad.toLowerCase().includes(searchColaborador.toLowerCase()))
                            )
                            .map((colaborador) => (
                            <CommandItem
                              key={colaborador.id}
                              value={colaborador.label}
                              onSelect={() => {
                                field.onChange(colaborador.id);
                                setOpenColaboradorCombo(false);
                              }}
                              className="cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mr-3 h-4 w-4",
                                  field.value === colaborador.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col py-1">
                                <span className="font-medium text-sm">{colaborador.label}</span>
                                <span className="text-xs text-muted-foreground">
                                  {colaborador.especialidad}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            />
            
            {/* Mostrar colaborador seleccionado */}
            {watchColaboradorId && (() => {
              const colaborador = colaboradoresEjemplo.find(c => c.id === watchColaboradorId);
              return colaborador ? (
                <div className="p-3 bg-muted/50 rounded-md border">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{colaborador.label}</div>
                      <div className="text-xs text-muted-foreground">{colaborador.especialidad}</div>
                    </div>
                    <Badge variant="default" className="text-xs">Responsable</Badge>
                  </div>
                </div>
              ) : null;
            })()}
            
            {errors.colaboradorId && (
              <p className="text-sm text-red-500">{errors.colaboradorId.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaso2 = () => (
    <div className="space-y-6 sm:space-y-8">
      {/* Sección: Configuración de Pago */}
      <div className="space-y-4 sm:space-y-6">
        <h3 className="text-base sm:text-lg font-semibold text-foreground border-b pb-2">Configuración de Pago</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Tipo de Pago */}
          <div>
            <Label htmlFor="tipoPago" className="text-sm font-medium">Tipo de Pago *</Label>
            <Controller
              name="tipoPago"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={cn("mt-1.5", errors.tipoPago ? "border-red-500" : "")}>
                    <SelectValue placeholder="Seleccionar tipo de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TipoPago.CONTADO}>Al Contado</SelectItem>
                    <SelectItem value={TipoPago.CUOTAS}>En Cuotas</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tipoPago && (
              <p className="text-sm text-red-500 mt-1">{errors.tipoPago.message}</p>
            )}
          </div>

          {/* Moneda */}
          <div>
            <Label htmlFor="moneda" className="text-sm font-medium">Moneda *</Label>
            <Controller
              name="moneda"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={cn("mt-1.5", errors.moneda ? "border-red-500" : "")}>
                    <SelectValue placeholder="Seleccionar moneda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Moneda.SOLES}>Soles (PEN)</SelectItem>
                    <SelectItem value={Moneda.DOLARES}>Dólares (USD)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.moneda && (
              <p className="text-sm text-red-500 mt-1">{errors.moneda.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Monto Total */}
          <div>
            <Label htmlFor="montoTotal" className="text-sm font-medium">Monto Total *</Label>
            <Controller
              name="montoTotal"
              control={control}
              render={({ field }) => (
                <div className="relative mt-1.5">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    id="montoTotal"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className={cn("pl-10", errors.montoTotal ? "border-red-500" : "")}
                  />
                </div>
              )}
            />
            {errors.montoTotal && (
              <p className="text-sm text-red-500 mt-1">{errors.montoTotal.message}</p>
            )}
          </div>

          {/* Número de Cuotas - Solo visible cuando es pago en cuotas */}
          {watchTipoPago === TipoPago.CUOTAS && (
            <div>
              <Label htmlFor="numeroCuotas" className="text-sm font-medium">Número de Cuotas *</Label>
              <Controller
                name="numeroCuotas"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={cn("mt-1.5", errors.numeroCuotas ? "border-red-500" : "")}>
                      <SelectValue placeholder="Seleccionar cuotas" />
                    </SelectTrigger>
                    <SelectContent>
                      {[2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} cuotas
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.numeroCuotas && (
                <p className="text-sm text-red-500 mt-1">{errors.numeroCuotas.message}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sección: Detalle de Cuotas - Solo visible cuando es pago en cuotas y hay cuotas generadas */}
      {watchTipoPago === TipoPago.CUOTAS && cuotasIndividuales.length > 0 && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Detalle de Cuotas</h3>
            <Badge variant="secondary" className="text-sm">
              {cuotasIndividuales.length} cuota{cuotasIndividuales.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cuotasIndividuales.map((cuota, index) => (
              <Card key={index} className="p-4 border-l-4 border-l-primary/50">
                <div className="space-y-3">
                  {/* Header de la cuota */}
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-foreground">
                      Cuota {cuota.numero}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {watchMoneda === Moneda.DOLARES ? 'USD' : 'PEN'}
                    </Badge>
                  </div>
                  
                  {/* Monto de la cuota */}
                  <div className="text-center py-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {watchMoneda === Moneda.DOLARES ? '$' : 'S/'}
                      {cuota.monto.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Monto de la cuota</p>
                  </div>
                  
                  {/* Fecha de vencimiento */}
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">
                      Fecha de Vencimiento
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1.5 h-9",
                            "text-sm"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-3 w-3" />
                          {format(cuota.fechaVencimiento, "dd/MM/yyyy", { locale: es })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={cuota.fechaVencimiento}
                          onSelect={(fecha: Date | undefined) => {
                            if (fecha) {
                              actualizarFechaCuota(index, fecha);
                            }
                          }}
                          disabled={(date) =>
                            date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Resumen total */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h4 className="font-semibold text-sm">Resumen del Pago</h4>
                <p className="text-xs text-muted-foreground">
                  {cuotasIndividuales.length} cuotas de{' '}
                  {watchMoneda === Moneda.DOLARES ? '$' : 'S/'}
                  {cuotasIndividuales.length > 0 ? cuotasIndividuales[0].monto.toFixed(2) : '0.00'} cada una
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  Total: {watchMoneda === Moneda.DOLARES ? '$' : 'S/'}
                  {(cuotasIndividuales.reduce((sum, cuota) => sum + cuota.monto, 0)).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Desde {cuotasIndividuales.length > 0 ? format(cuotasIndividuales[0].fechaVencimiento, "MMM yyyy", { locale: es }) : ''} 
                  {' '}hasta {cuotasIndividuales.length > 0 ? format(cuotasIndividuales[cuotasIndividuales.length - 1].fechaVencimiento, "MMM yyyy", { locale: es }) : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje informativo para pago al contado */}
      {watchTipoPago === TipoPago.CONTADO && watchMontoTotal && (
        <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            <div>
              <h4 className="font-semibold text-green-800 dark:text-green-200 text-sm">
                Pago al Contado Configurado
              </h4>
              <p className="text-green-700 dark:text-green-300 text-xs mt-1">
                Monto total: {watchMoneda === Moneda.DOLARES ? '$' : 'S/'}{parseFloat(watchMontoTotal || '0').toFixed(2)}
                {' '}({watchMoneda === Moneda.DOLARES ? 'USD' : 'PEN'}) - Pago único al completar el proyecto
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPaso3 = () => (
    <div className="space-y-6 sm:space-y-8">
      {/* Sección: Selección de Entregables */}
      <div className="space-y-4 sm:space-y-6">
        <h3 className="text-base sm:text-lg font-semibold text-foreground border-b pb-2">Entregables del Proyecto</h3>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Agregar Entregables *</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Busque y seleccione los entregables o agregue uno personalizado si no lo encuentra
            </p>
            
            {/* Selector con buscador */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between h-auto min-h-[40px] py-2"
                >
                  <span className="text-left text-muted-foreground">
                    Buscar entregable o agregar uno nuevo...
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[500px] max-w-[90vw] p-0">
                <EntregableCombobox
                  onSelect={handleAgregarEntregablePredefinido}
                  onAddCustom={handleAgregarEntregable}
                  selectedEntregables={entregablesCustomizados}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Lista de entregables seleccionados */}
          {entregablesCustomizados.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Entregables Seleccionados ({entregablesCustomizados.length})
              </Label>
              
              <div className="space-y-2">
                {entregablesCustomizados.map((entregable, index) => (
                  <Card key={entregable.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        {entregable.esPredefinido ? (
                          <div>
                            <div className="font-medium text-sm">{entregable.nombre}</div>
                            <Badge variant="outline" className="mt-1 text-xs">
                              Predefinido
                            </Badge>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Input
                              value={entregable.nombre}
                              onChange={(e) => {
                                const nuevosEntregables = [...entregablesCustomizados];
                                nuevosEntregables[index].nombre = e.target.value;
                                setEntregablesCustomizados(nuevosEntregables);
                                setValue("entregables", nuevosEntregables);
                              }}
                              placeholder="Nombre del entregable personalizado"
                              className="text-sm"
                            />
                            <Badge variant="secondary" className="text-xs">
                              Personalizado
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEliminarEntregable(index)}
                        className="ml-2 h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {entregablesCustomizados.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-muted-foreground">No hay entregables</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Agregue al menos un entregable para continuar con el proyecto
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Indicador de Pasos */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-4 sm:py-6 bg-muted/30 rounded-lg overflow-x-auto">
        {pasos.map((paso, index) => {
          const Icon = paso.icon;
          const isCompleted = pasoActual > paso.id;
          const isActive = pasoActual === paso.id;
          
          return (
            <div key={paso.id} className="flex items-center min-w-0 flex-shrink-0">
              <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 ${
                isCompleted ? "bg-primary border-primary text-primary-foreground" :
                isActive ? "border-primary text-primary bg-primary/10" : "border-muted text-muted-foreground"
              }`}>
                {isCompleted ? <Check className="h-5 w-5 sm:h-6 sm:w-6" /> : <Icon className="h-5 w-5 sm:h-6 sm:w-6" />}
              </div>
              <div className="ml-2 sm:ml-4 hidden sm:block">
                <div className={`text-sm sm:text-base font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {paso.title}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">{paso.description}</div>
              </div>
              {index < pasos.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 ml-2 sm:ml-6 ${isCompleted ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Contenido del Paso */}
      <Card className="p-4 sm:p-6 lg:p-8 min-h-[500px] sm:min-h-[600px]">
        {pasoActual === 1 && renderPaso1()}
        {pasoActual === 2 && renderPaso2()}
        {pasoActual === 3 && renderPaso3()}
      </Card>

      {/* Botones de Navegación */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 sm:pt-6 border-t bg-background">
        <div>
          {pasoActual > 1 && (
            <Button type="button" variant="outline" size="default" className="w-full sm:w-auto" onClick={handlePasoAnterior}>
              <ChevronLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Anterior
            </Button>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <Button type="button" variant="outline" size="default" className="w-full sm:w-auto" onClick={onCancel}>
            Cancelar
          </Button>
          
          {pasoActual < 3 ? (
            <Button type="button" size="default" className="w-full sm:w-auto" onClick={handlePasoSiguiente}>
              Siguiente
              <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              size="default"
              className="w-full sm:w-auto"
              disabled={entregablesCustomizados.length === 0}
            >
              {proyecto ? "Actualizar" : "Crear"} Proyecto
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
