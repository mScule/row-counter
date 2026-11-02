import { useQuery } from "@tanstack/react-query";
import { getCollection } from "@/storage/collection/getCollection";

import type { Project } from "@/types/project";

export function useQueryAllProjects() {
  return useQuery({
    queryKey: ["project"],
    queryFn: async () => {
      const collection = await getCollection<Project>("project");

      return Object.entries(collection).map(([key, value]) => ({
        id: key,
        ...value,
      }));
    },
  });
}
