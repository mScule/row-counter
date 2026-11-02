import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEntry } from "@/storage/entry/updateEntry";

import type { AppSettings } from "@/types/app-settings";

type Payload = {
  settings: Partial<AppSettings>;
};

export function useUpdateAppSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ settings }: Payload) => {
      return await updateEntry<AppSettings>("settings", "app", settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
