import type { CounterColor } from "@/types/counter";

type CounterColorStyle = {
  label: string;
  swatch: string;
  border: string;
  text: string;
  button: string;
};

export const DEFAULT_COUNTER_COLOR: CounterColor = "BABY_PINK";

// Light and pink themes use darker shades so borders stand out from the light background.
// Name, count and button icons share one slightly faded shade on light themes.
// Tailwind needs full class names in source, so they can't be built from the color name
export const COUNTER_COLORS: Record<CounterColor, CounterColorStyle> = {
  BABY_PINK: {
    label: "Baby pink",
    swatch: "bg-pink-400 dark:bg-pink-300",
    border: "border-pink-400 dark:border-pink-300",
    text: "text-pink-700/85 dark:text-pink-300",
    button: "bg-pink-400 hover:bg-pink-400/80 dark:bg-pink-300 dark:hover:bg-pink-300/80 text-pink-700/85 dark:text-pink-950"
  },
  MINT_GREEN: {
    label: "Mint green",
    swatch: "bg-emerald-400 dark:bg-emerald-300",
    border: "border-emerald-400 dark:border-emerald-300",
    text: "text-emerald-700/85 dark:text-emerald-300",
    button: "bg-emerald-400 hover:bg-emerald-400/80 dark:bg-emerald-300 dark:hover:bg-emerald-300/80 text-emerald-700/85 dark:text-emerald-950"
  },
  LIGHT_GREEN: {
    label: "Light green",
    swatch: "bg-lime-400 dark:bg-lime-300",
    border: "border-lime-400 dark:border-lime-300",
    text: "text-lime-700/85 dark:text-lime-300",
    button: "bg-lime-400 hover:bg-lime-400/80 dark:bg-lime-300 dark:hover:bg-lime-300/80 text-lime-700/85 dark:text-lime-950"
  },
  BABY_BLUE: {
    label: "Baby blue",
    swatch: "bg-sky-400 dark:bg-sky-300",
    border: "border-sky-400 dark:border-sky-300",
    text: "text-sky-700/85 dark:text-sky-300",
    button: "bg-sky-400 hover:bg-sky-400/80 dark:bg-sky-300 dark:hover:bg-sky-300/80 text-sky-700/85 dark:text-sky-950"
  },
  LILAC: {
    label: "Lilac",
    swatch: "bg-violet-400 dark:bg-violet-300",
    border: "border-violet-400 dark:border-violet-300",
    text: "text-violet-700/85 dark:text-violet-300",
    button: "bg-violet-400 hover:bg-violet-400/80 dark:bg-violet-300 dark:hover:bg-violet-300/80 text-violet-700/85 dark:text-violet-950"
  }
};

// Counters saved before colors were added don't have one
export function counterColor(color: CounterColor | undefined): CounterColorStyle {
  return COUNTER_COLORS[color ?? DEFAULT_COUNTER_COLOR] ?? COUNTER_COLORS[DEFAULT_COUNTER_COLOR];
}
