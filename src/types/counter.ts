import z from "zod";

export const CounterColorSchema = z.enum([
  "BABY_PINK",
  "MINT_GREEN",
  "LIGHT_GREEN",
  "BABY_BLUE",
  "LILAC"
]);

export type CounterColor = z.infer<typeof CounterColorSchema>;

export const CounterSchema = z.object({
  kind: z.literal("COUNTER"),
  name: z
    .string()
    .min(1, "Name cannot be smaller than 1 characters"),
  count: z
    .number()
    .min(0, "Count cannot be smaller than 0"),
  color: CounterColorSchema
});

export type Counter = z.infer<typeof CounterSchema>;
