import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveWorkflow } from "../services/api";
import type { Node, Edge } from "../types/workflow";

interface SaveWorkflowParams {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
}

export const useSaveWorkflowMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name, nodes, edges }: SaveWorkflowParams) =>
      saveWorkflow(id, name, nodes, edges),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
};
