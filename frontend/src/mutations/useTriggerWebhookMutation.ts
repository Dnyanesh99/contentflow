import { useMutation, useQueryClient } from "@tanstack/react-query";
import { triggerWebhook } from "../services/api";

export const useTriggerWebhookMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => triggerWebhook(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["executions"] });
    },
  });
};
