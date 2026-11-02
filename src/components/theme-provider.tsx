import { useEffect, type PropsWithChildren } from "react";

import { useQueryAppSettings } from "@/react-query/hooks/settings/use-query-app-settings";
import type { AppTheme } from "@/types/app-settings";

const THEME_CLASSES: Record<AppTheme, string> = {
  PINK: "pink",
  LIGHT: "light",
  DARK: "dark",
};

export function ThemeProvider({ children }: PropsWithChildren) {
  const settings = useQueryAppSettings();
  const theme = settings.data?.theme;

  useEffect(() => {
    // Keep the class set in index.html until settings have been read
    if (!theme) {
      return;
    }

    const root = window.document.documentElement;

    root.classList.remove(...Object.values(THEME_CLASSES));
    root.classList.add(THEME_CLASSES[theme]);
  }, [theme]);

  return children;
}
