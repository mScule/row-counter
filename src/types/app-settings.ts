import z from "zod";

export const AppThemeSchema = z.enum([
    "PINK",
    "LIGHT",
    "DARK",
]);

export type AppTheme = z.infer<typeof AppThemeSchema>;

export const AppSettingsSchema = z.object({
    theme: AppThemeSchema,
});

export type AppSettings = z.infer<typeof AppSettingsSchema>;
