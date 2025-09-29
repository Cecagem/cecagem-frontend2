"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface ServerPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  isLoading?: boolean;
  title?: string;
  icon?: LucideIcon;
  noDataMessage?: string;
  enablePagination?: boolean;
  enableSorting?: boolean;
  pageSize?: number;
  enableColumnFilters?: boolean;
  selectedItem?: TData | null;
  detailComponent?: (data: TData) => React.ReactNode;
  detailTitle?: (data: TData) => string;
  onRowClick?: (data: TData | null) => void;
  getItemId?: (data: TData) => string | number;
  // Nuevas props para paginación del servidor
  serverPagination?: boolean;
  paginationMeta?: ServerPaginationMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function DataTable<TData>({
  data,
  columns,
  isLoading = false,
  title,
  icon: Icon,
  noDataMessage = "No se encontraron datos.",
  enablePagination = true,
  enableSorting = true,
  pageSize = 10,
  enableColumnFilters = false,
  selectedItem,
  detailComponent,
  detailTitle,
  onRowClick,
  getItemId = (item: TData) => (item as { id: string | number }).id,
  serverPagination = false,
  paginationMeta,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const detailRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Scroll automático cuando se selecciona un item
  useEffect(() => {
    if (selectedItem && detailRef.current) {
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest' 
        });
      }, 150);
    }
  }, [selectedItem]);

  // Función para cerrar el detalle y volver arriba
  const handleCloseDetail = () => {
    onRowClick?.(null); // Cerrar el detalle
    
    // Hacer scroll hacia arriba después de un breve delay para permitir que se cierre el detalle
    setTimeout(() => {
      tableRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest' 
      });
    }, 150);
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: enableSorting ? setSorting : undefined,
    getCoreRowModel: getCoreRowModel(),
    // Solo usar paginación del cliente si no es paginación del servidor
    getPaginationRowModel: !serverPagination ? undefined : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableColumnFilters ? getFilteredRowModel() : undefined,
    // Para paginación del servidor, no manejamos el estado aquí
    manualPagination: serverPagination,
    state: {
      ...(enableSorting && { sorting }),
    },
  });

  const LoadingSkeleton = () => {
    // Usar un array de anchos fijos para evitar hydration mismatch
    const skeletonWidths = [120, 80, 100, 90, 70, 130, 110, 95];
    
    return (
      <div className="space-y-4">
        {Array.from({ length: pageSize }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            {columns.map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-4 bg-muted rounded animate-pulse"
                style={{ width: `${skeletonWidths[colIndex % skeletonWidths.length]}px` }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        {title && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {Icon && <Icon className="h-5 w-5" />}
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  // Funciones para manejar paginación del servidor
  const handlePageSizeChange = (newPageSize: string) => {
    const size = Number(newPageSize);
    if (serverPagination && onPageSizeChange) {
      onPageSizeChange(size);
    } else {
      table.setPageSize(size);
    }
  };

  const handleFirstPage = () => {
    if (serverPagination && onPageChange) {
      onPageChange(1);
    } else {
      table.setPageIndex(0);
    }
  };

  const handlePreviousPage = () => {
    if (serverPagination && onPageChange && paginationMeta) {
      onPageChange(paginationMeta.page - 1);
    } else {
      table.previousPage();
    }
  };

  const handleNextPage = () => {
    if (serverPagination && onPageChange && paginationMeta) {
      onPageChange(paginationMeta.page + 1);
    } else {
      table.nextPage();
    }
  };

  const handleLastPage = () => {
    if (serverPagination && onPageChange && paginationMeta) {
      onPageChange(paginationMeta.totalPages);
    } else {
      table.setPageIndex(table.getPageCount() - 1);
    }
  };

  // Determinar valores de paginación según el tipo
  const currentPage = serverPagination ? paginationMeta?.page || 1 : table.getState().pagination.pageIndex + 1;
  const totalPages = serverPagination ? paginationMeta?.totalPages || 1 : table.getPageCount();
  const currentPageSize = serverPagination ? paginationMeta?.limit || pageSize : table.getState().pagination.pageSize;
  const canPreviousPage = serverPagination ? paginationMeta?.hasPrevious || false : table.getCanPreviousPage();
  const canNextPage = serverPagination ? paginationMeta?.hasNext || false : table.getCanNextPage();
  const totalItems = serverPagination ? paginationMeta?.total || 0 : data.length;

  return (
    <div className="space-y-6">
      <Card ref={tableRef}>
        <CardContent className="px-5">
          {/* Table Container - Responsive */}
          <div className="border rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead
                            key={header.id}
                            className="h-10 px-4 sm:px-6 whitespace-nowrap"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className={`
                          hover:bg-muted/50 
                          ${onRowClick ? 'cursor-pointer' : ''} 
                          ${selectedItem && getItemId(selectedItem) === getItemId(row.original) ? 'bg-muted/30 border-l-4 border-l-primary' : ''}
                        `}
                        onClick={() => onRowClick?.(row.original)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="px-4 sm:px-6 py-3 sm:py-4"
                            onClick={(e) => {
                              // Prevenir propagación si es la columna de acciones
                              if (cell.column.id === 'actions') {
                                e.stopPropagation();
                              }
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-muted-foreground"
                      >
                        {noDataMessage}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Paginación */}
          {enablePagination && totalItems > 0 && (
            <div className="mt-4 pt-4 border-t">
              {/* Información de registros */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Información de registros y selector de página */}
                <div className="flex items-center gap-4 order-2 sm:order-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Mostrar:</span>
                    <Select
                      value={currentPageSize.toString()}
                      onValueChange={handlePageSizeChange}
                    >
                      <SelectTrigger className="w-16 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">por página</span>
                  </div>
                  
                  {/* Mostrar información de registros */}
                  <div className="text-sm text-muted-foreground">
                    {serverPagination ? (
                      <>
                        Mostrando {((currentPage - 1) * currentPageSize) + 1} a {Math.min(currentPage * currentPageSize, totalItems)} de {totalItems} registros
                      </>
                    ) : (
                      <>
                        Mostrando {data.length} registros
                      </>
                    )}
                  </div>
                </div>

                {/* Controles de navegación */}
                <div className="flex items-center gap-1 order-1 sm:order-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFirstPage}
                    disabled={!canPreviousPage}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                    <span className="sr-only">Primera página</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={!canPreviousPage}
                    className="h-8 px-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Anterior</span>
                    <span className="sr-only sm:hidden">Anterior</span>
                  </Button>

                  <div className="flex items-center justify-center min-w-[100px] text-sm font-medium">
                    Página {currentPage} de {totalPages}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!canNextPage}
                    className="h-8 px-2"
                  >
                    <span className="hidden sm:inline mr-1">Siguiente</span>
                    <span className="sr-only sm:hidden">Siguiente</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLastPage}
                    disabled={!canNextPage}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronsRight className="h-4 w-4" />
                    <span className="sr-only">Última página</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Componente de detalle - card separada con título */}
      {selectedItem && detailComponent && (
        <div 
          ref={detailRef}
          className="animate-in slide-in-from-top-4 duration-300"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {detailTitle ? detailTitle(selectedItem) : 'Detalles'}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCloseDetail}
                  className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  title="Cerrar detalles y volver arriba"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {detailComponent(selectedItem)}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
