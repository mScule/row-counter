import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEntry } from "@/storage/entry/deleteEntry";

type Payload = {
  id: string;
};

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    scope: { id: "project" },
    mutationFn: async ({ id }: Payload) => {
      return await deleteEntry("project", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
  });
}
