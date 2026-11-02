import { useQuery } from "@tanstack/react-query";
import { readEntry } from "@/storage/entry/readEntry";

import type { Project } from "@/types/project";

export function useQueryProject(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const project = await readEntry<Project>("project", id);

      if (!project) {
        return null;
      }

      return { id, ...project };
    },
  });
}
