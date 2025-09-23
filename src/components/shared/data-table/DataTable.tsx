"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  PaginationState,
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
} from "lucide-react";
import { LucideIcon } from "lucide-react";

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
  onRowClick?: (data: TData) => void;
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
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });
  const detailRef = useRef<HTMLDivElement>(null);

  // Scroll automático cuando se selecciona un item
  useEffect(() => {
    if (selectedItem && detailRef.current) {
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [selectedItem]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: enableSorting ? setSorting : undefined,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableColumnFilters
      ? getFilteredRowModel()
      : undefined,
    onPaginationChange: enablePagination ? setPagination : undefined,
    state: {
      ...(enableSorting && { sorting }),
      ...(enablePagination && { pagination }),
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

  return (
    <div className="space-y-6">
      <Card>
        {/* {title && (
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              {Icon && <Icon className="h-5 w-5" />}
              {title}
            </CardTitle>
          </CardHeader>
        )} */}
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
                          ${selectedItem === row.original ? 'bg-muted/30 border-l-4 border-l-primary' : ''}
                        `}
                        onClick={() => onRowClick?.(row.original)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="px-4 sm:px-6 py-3 sm:py-4"
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
          {enablePagination && data.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              {/* Controles de paginación y selector */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Selector de cantidad por página */}
                <div className="flex items-center gap-2 order-2 sm:order-1">
                  <span className="text-sm text-muted-foreground">Mostrar:</span>
                  <Select
                    value={table.getState().pagination.pageSize.toString()}
                    onValueChange={(value) => {
                      table.setPageSize(Number(value));
                    }}
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
                  <span className="text-sm text-muted-foreground">
                    por página
                  </span>
                </div>

                {/* Controles de navegación */}
                <div className="flex items-center gap-1 order-1 sm:order-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                    <span className="sr-only">Primera página</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="h-8 px-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Anterior</span>
                    <span className="sr-only sm:hidden">Anterior</span>
                  </Button>

                  <div className="flex items-center justify-center min-w-[100px] text-sm font-medium">
                    Página {table.getState().pagination.pageIndex + 1} de{" "}
                    {table.getPageCount()}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="h-8 px-2"
                  >
                    <span className="hidden sm:inline mr-1">Siguiente</span>
                    <span className="sr-only sm:hidden">Siguiente</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
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
        <div ref={detailRef}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {detailTitle ? detailTitle(selectedItem) : 'Detalles'}
              </CardTitle>
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
