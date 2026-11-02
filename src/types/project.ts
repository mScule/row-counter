import z from "zod";
import { CounterSchema } from "./counter";
import { LimitedCounterSchema } from "./limited-counter";

export const AnyCounterSchema = z.discriminatedUnion("kind", [
  CounterSchema,
  LimitedCounterSchema
]);

export type AnyCounter = z.infer<typeof AnyCounterSchema>;

export const ProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Name cannot be smaller than 1 characters"),
  counters: z.array(AnyCounterSchema),
  notes: z
    .string(),
});

export type Project = z.infer<typeof ProjectSchema>;
