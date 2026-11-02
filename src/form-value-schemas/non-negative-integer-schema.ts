import z from "zod";

export const NonNegativeIntegerSchema = z.string().refine(value => Number.isInteger(Number(value)) && Number(value) >= 0, {
  error: "Value has to be 0 or a positive integer"
});
