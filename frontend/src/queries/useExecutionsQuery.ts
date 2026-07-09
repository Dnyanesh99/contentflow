import { useQuery } from "@tanstack/react-query";
import { getExecutions } from "../services/api";
import type { Execution } from "../types/workflow";

export const useExecutionsQuery = (isOpen: boolean = false) => {
  return useQuery({
    queryKey: ["executions"],
    queryFn: getExecutions,
    refetchInterval: (query) => {
      if (isOpen) return 3000;

      const executions = query.state.data as Execution[] | undefined;
      if (!executions || !Array.isArray(executions)) {
        return false;
      }
      const hasRunning = executions.some((exec) => exec.status === "RUNNING");
      return hasRunning ? 3000 : false;
    },
  });
};
