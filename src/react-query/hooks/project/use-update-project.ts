import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEntry } from "@/storage/entry/updateEntry";

import type { Project } from "@/types/project";

type Payload = {
  id: string;
  project: Partial<Project>;
};

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    scope: { id: "project" },
    mutationFn: async ({ id, project }: Payload) => {
      return await updateEntry<Project>("project", id, project);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
  });
}
