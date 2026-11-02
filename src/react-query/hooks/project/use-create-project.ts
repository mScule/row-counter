import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEntry } from "@/storage/entry/createEntry";
import type { Project } from "@/types/project";

type Payload = {
  project: Project;
};

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    scope: { id: "project" },
    mutationFn: async ({ project }: Payload) => {
      return await createEntry("project", project);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
  });
}
