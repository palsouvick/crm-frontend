import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCrudMutation = ({ mutationFn, queryKey }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
};

export default useCrudMutation;
