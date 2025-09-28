import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { profileService } from "../services/profile.service";
import { UserProfile } from "../types/profile.types";
import { useAuthStore } from "@/features/auth";

export const useCurrentUser = () => {
  const queryClient = useQueryClient();
  const { user: authUser, isAuthenticated } = useAuthStore();

  // Invalidate query when user changes or logs out
  useEffect(() => {
    if (!isAuthenticated) {
      queryClient.removeQueries({ queryKey: ["current-user"] });
    } else if (authUser?.id) {
      // Invalidate when user ID changes (different user logged in)
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    }
  }, [authUser?.id, isAuthenticated, queryClient]);

  return useQuery<UserProfile>({
    queryKey: ["current-user", authUser?.id],
    queryFn: profileService.getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};