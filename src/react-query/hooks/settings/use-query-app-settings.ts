import { useQuery } from "@tanstack/react-query";
import { readEntry } from "@/storage/entry/readEntry";

import { AppSettingsSchema, type AppSettings } from "@/types/app-settings";

export const DEFAULT_APP_SETTINGS: AppSettings = {
  theme: "DARK",
};

export function useQueryAppSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const settings = await readEntry<AppSettings>("settings", "app");

      // Fall back to defaults when nothing is saved yet or the saved value is outdated
      const parsed = AppSettingsSchema.safeParse({ ...DEFAULT_APP_SETTINGS, ...settings });

      return parsed.success ? parsed.data : DEFAULT_APP_SETTINGS;
    },
  });
}
