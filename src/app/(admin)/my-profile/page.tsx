"use client";

import { AdminHeader } from "@/components/shared";
import { ProfileView } from "@/features/my-profile";

export default function MyProfile() {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <AdminHeader title="Mi Perfil" />

      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <ProfileView />
      </div>
    </div>
  );
}
