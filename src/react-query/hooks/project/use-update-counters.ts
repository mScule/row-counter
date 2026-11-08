import { useMutation, useQueryClient } from "@tanstack/react-query";
import { readEntry } from "@/storage/entry/readEntry";
import { updateEntry } from "@/storage/entry/updateEntry";
import { useCounterHistory } from "@/contexts/use-counter-history";

import type { AnyCounter, Project } from "@/types/project";

type Payload = {
  id: string;
  update: (counters: AnyCounter[]) => AnyCounter[];
  // When given, the change is recorded to the session history under this label
  label?: string;
};

// Reads the latest stored counters before applying the update, and shares the mutation scope
// with project updates so rapid clicks are applied one after another instead of overwriting each other
export function useUpdateCounters() {
  const queryClient = useQueryClient();
  const { addEntry } = useCounterHistory();

  return useMutation({
    scope: { id: "project" },
    mutationFn: async ({ id, update }: Payload) => {
      const project = await readEntry<Project>("project", id);

      if (!project) {
        throw new Error(`Project ${id} not found`);
      }

      const before = project.counters;
      const after = update(before);

      await updateEntry<Project>("project", id, { counters: after });

      return { before, after };
    },
    onSuccess: ({ before, after }, { id, label }) => {
      if (label) {
        addEntry(id, { label, before, after });
      }

      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
  });
}
