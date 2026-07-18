import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "../api/dashboardApi";

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: () => getDashboardSummary().then((res) => res.data),
  });
};
