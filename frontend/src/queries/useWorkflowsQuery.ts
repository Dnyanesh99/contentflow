import { useQuery } from '@tanstack/react-query';
import { getWorkflows } from '../services/api';

export const useWorkflowsQuery = () => {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: getWorkflows,
  });
};
