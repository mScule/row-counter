import {toast} from "sonner";
import {SettingsIcon} from "lucide-react";
import {Button} from "@/shadcn/ui/button";
import {Field, FieldGroup, FieldLabel} from "@/shadcn/ui/field";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/shadcn/ui/dialog";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/shadcn/ui/select";
import {AppThemeSchema, type AppTheme} from "@/types/app-settings";
import {DEFAULT_APP_SETTINGS, useQueryAppSettings} from "@/react-query/hooks/settings/use-query-app-settings";
import {useUpdateAppSettings} from "@/react-query/hooks/settings/use-update-app-settings";

const THEME_LABELS: Record<AppTheme, string> = {
  PINK: "Pink",
  LIGHT: "Light",
  DARK: "Dark"
};

export function AppSettingsForm() {
  const settings = useQueryAppSettings();
  const updateSettings = useUpdateAppSettings();

  const theme = settings.data?.theme ?? DEFAULT_APP_SETTINGS.theme;

  // Settings are saved right away so the theme can be previewed while the dialog is open
  async function changeTheme(value: string) {
    const parsed = AppThemeSchema.safeParse(value);

    if (!parsed.success) {
      return;
    }

    try {
      await updateSettings.mutateAsync({settings: {theme: parsed.data}});
    } catch {
      toast.error(`Error saving settings`);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" aria-label="Settings">
          <SettingsIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel>Theme</FieldLabel>
            <Select value={theme} onValueChange={changeTheme}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AppThemeSchema.options.map(theme => (
                  <SelectItem key={theme} value={theme}>
                    {THEME_LABELS[theme]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </DialogContent>
    </Dialog>
  );
}
