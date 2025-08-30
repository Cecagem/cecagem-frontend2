"use client";

import { useAuth } from "@/features/auth";
import type React from "react";

interface AuthInitializerProps {
  children: React.ReactNode;
}

export const AuthInitializer = ({ children }: AuthInitializerProps) => {
  useAuth();

  return <>{children}</>;
};
