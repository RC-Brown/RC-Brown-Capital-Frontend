import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getDashboardMetrics } from "@/src/services/dashboard";

export function useDashboardMetrics() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error("No authentication token available");
      }

      return getDashboardMetrics(session.accessToken);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!session?.accessToken,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
}
