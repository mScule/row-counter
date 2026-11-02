import z from "zod";

import { CounterSchema } from "./counter";

// Count wraps around between 0 and limit - 1, so the counter can be used for repeating patterns
export const LimitedCounterSchema = CounterSchema.extend({
  kind: z.literal("LIMITED_COUNTER"),
  limit: z
    .number()
    .min(1, "Limit cannot be smaller than 1")
}).refine(v => v.count < v.limit, {
  error: "Count must be smaller than limit"
});

export type LimitedCounter = z.infer<typeof LimitedCounterSchema>;
