import type { AnyCounter } from "@/types/project";

// Limited counters wrap around, regular counters stop at 0
export function stepCounter(counter: AnyCounter, step: number): AnyCounter {
  const count = counter.count + step;

  if (counter.kind === "LIMITED_COUNTER") {
    return { ...counter, count: ((count % counter.limit) + counter.limit) % counter.limit };
  }

  return { ...counter, count: Math.max(0, count) };
}
