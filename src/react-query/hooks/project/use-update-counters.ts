import { useMutation, useQueryClient } from "@tanstack/react-query";
import { readEntry } from "@/storage/entry/readEntry";
import { updateEntry } from "@/storage/entry/updateEntry";

import type { AnyCounter, Project } from "@/types/project";

type Payload = {
  id: string;
  update: (counters: AnyCounter[]) => AnyCounter[];
};

// Reads the latest stored counters before applying the update, and shares the mutation scope
// with project updates so rapid clicks are applied one after another instead of overwriting each other
export function useUpdateCounters() {
  const queryClient = useQueryClient();

  return useMutation({
    scope: { id: "project" },
    mutationFn: async ({ id, update }: Payload) => {
      const project = await readEntry<Project>("project", id);

      if (!project) {
        throw new Error(`Project ${id} not found`);
      }

      return await updateEntry<Project>("project", id, { counters: update(project.counters) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
  });
}
