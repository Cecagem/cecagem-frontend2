"use client";

import type React from "react";
import { useId, useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import ModeToggle from "@/components/themes/mode-toggle";
// import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import { loginSchema, LoginFormData, useLogin } from "@/features/auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const emailId = useId();
  const passwordId = useId();
  // const router = useRouter();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    control,
    // setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // const userAccount = {
  //   super_admin: {
  //     name: "super_admin",
  //     email: "superadmin@cecagem.com",
  //     password: "123456",
  //   },
  //   admin: {
  //     name: "admin",
  //     email: "admin@cecagem.com",
  //     password: "123456",
  //   },
  //   rrhh: {
  //     name: "rrhh",
  //     email: "rrhh@cecagem.com",
  //     password: "123456",
  //   },
  //   colaborador_interno: {
  //     name: "colaborador_interno",
  //     email: "carlos.mendoza@cecagem.com",
  //     password: "123456",
  //   },
  //   colaborador_externo: {
  //     name: "colaborador_externo",
  //     email: "diana.torres@freelance.com",
  //     password: "123456",
  //   },
  // };

  const onSubmit = async (data: LoginFormData) => {
    login.mutate(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          // setTimeout(() => {
          //   window.location.href = "/home";
          // }, 300);
        },
      }
    );
  };

  // const fillCredentials = (
  //   account: { email: string; password: string },
  //   autoSubmit = false
  // ) => {
  //   setValue("email", account.email, { shouldValidate: true });
  //   setValue("password", account.password, { shouldValidate: true });
  //   if (autoSubmit) {
  //     handleSubmit(onSubmit)();
  //   }
  // };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 drop-blur-md backdrop-blur-xl">
        <div className="absolute top-4 right-4 z-10">
          <ModeToggle />
        </div>
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                {/* Logo para móvil */}
                <div className="flex justify-center mb-4 md:hidden">
                  <Image
                    src="/image/logos/logocecagem.png"
                    alt="CECAGEM logo"
                    width={180}
                    height={180}
                    className="block dark:hidden"
                  />
                  <Image
                    src="/image/logos/logoblanco.png"
                    alt="CECAGEM logo"
                    width={180}
                    height={180}
                    className="hidden dark:block"
                  />
                </div>
                <h1 className=" text-2xl font-bold">Inicia sesión</h1>
                <p className="text-muted-foreground text-balance">
                  Accede a tu plataforma de consultoría de tesis
                </p>
              </div>

              <div className="space-y-1">
                <div className="group relative">
                  <FloatingLabel htmlFor={emailId} label="Correo electrónico" />
                  <Input
                    id={emailId}
                    type="email"
                    placeholder=" "
                    autoFocus
                    {...register("email")}
                    className={`bg-card! h-11 ${
                      errors.email
                        ? "border-destructive focus-visible:ring-2 focus-visible:ring-destructive/50 focus-visible:border-destructive"
                        : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email.message}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="group relative">
                  <FloatingLabel htmlFor={passwordId} label="Contraseña" />
                  <Input
                    id={passwordId}
                    type={showPassword ? "text" : "password"}
                    placeholder=" "
                    {...register("password")}
                    className={`bg-card! h-11 ${
                      errors.password
                        ? "border-destructive focus-visible:ring-2 focus-visible:ring-destructive/50 focus-visible:border-destructive pr-10"
                        : "pr-10"
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.password.message}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="rememberMe"
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                  )}
                />
                <Label htmlFor="rememberMe" className="text-sm">
                  Recuérdame
                </Label>
                <a
                  href="/forgot-password"
                  className="ml-auto text-sm underline-offset-2 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <Button
                type="submit"
                disabled={login.isPending}
                className="w-full bg-linear-to-r from-primary to-secondary dark:from-primary/80 dark:to-secondary/80 text-white"
              >
                {login.isPending ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>

              {/* <div className="flex flex-wrap gap-2">
                {Object.entries(userAccount).map(([key, account]) => (
                  <Button
                    key={key}
                    variant={"outline"}
                    onClick={() => fillCredentials(account)}
                    className="capitalize "
                  >
                    {account.name.replace("_", " ")}
                  </Button>
                ))}
              </div> */}

              <div className="text-center text-sm text-muted-foreground">
                ¿Tienes problemas para iniciar sesión?{" "}
                <a
                  href="#"
                  className="underline underline-offset-4 dark:hover:text-white"
                >
                  Contacta soporte técnico
                </a>
                .
              </div>
              <div className="text-center text-sm text-muted-foreground">
                <p>Software v.1.1.0</p>
              </div>
            </div>
          </form>

          {/* Logo y Sección de Administración */}
          <div className="bg-linear-to-l from-primary/20 to-secondary/20 dark:from-primary/60 dark:to-secondary/60 relative hidden md:flex md:flex-col md:items-center md:justify-center p-8">
            <div className="text-center space-y-6">
              {/* Logo */}
              <div className="mx-auto flex items-center justify-center">
                <Image
                  src="/image/logos/logocecagem.png"
                  alt="CECAGEM logo"
                  width={180}
                  height={180}
                  className="block dark:hidden"
                />
                <Image
                  src="/image/logos/logoblanco.png"
                  alt="CECAGEM logo"
                  width={180}
                  height={180}
                  className="hidden dark:block"
                />
              </div>

              <div className="space-y-3">
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-xs">
                  Plataforma de consultoría académica y apoyo en proyectos de
                  investigación.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground text-center text-xs text-balance">
        Al hacer clic en continuar, aceptas nuestros{" "}
        <a
          href="#"
          className="underline underline-offset-4 hover:text-primary dark:hover:text-white"
        >
          Términos de Servicio
        </a>{" "}
        y{" "}
        <a
          href="#"
          className="underline underline-offset-4 hover:text-primary dark:hover:text-white"
        >
          Política de Privacidad
        </a>
        . CECAGEM - Consultoría especializada en tesis y proyectos académicos.
      </div>
    </div>
  );
}

function FloatingLabel({ htmlFor, label }: { htmlFor: string; label: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="origin-start text-muted-foreground/70 group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium"
    >
      <span className="bg-card inline-flex px-2 select-none">{label}</span>
    </label>
  );
}
