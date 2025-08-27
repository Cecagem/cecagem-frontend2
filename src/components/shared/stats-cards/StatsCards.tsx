import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'error';
  loading?: boolean;
}

const variantStyles = {
  default: "text-blue-600",
  success: "text-green-600", 
  warning: "text-orange-600",
  error: "text-red-600"
};

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  variant = 'default',
  loading = false 
}: StatCardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-3 w-20 bg-muted rounded animate-pulse" />
              <div className="h-6 w-8 bg-muted rounded animate-pulse" />
              <div className="h-3 w-16 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-8 w-8 bg-muted rounded-md animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-all hover:shadow-sm">
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {title}
            </p>
            <p className={`text-xl font-bold ${variantStyles[variant]}`}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="p-2 rounded-md bg-muted/50">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface StatsGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
}

export function StatsGrid({ children, columns = 4 }: StatsGridProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3", 
    4: "md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={`grid gap-3 ${gridCols[columns]}`}>
      {children}
    </div>
  );
}
