import {CheckIcon} from "lucide-react";
import {cn} from "@/shadcn/utils";
import {CounterColorSchema, type CounterColor} from "@/types/counter";
import {COUNTER_COLORS} from "@/utils/counter-colors";

type Props = {
  value: CounterColor;
  onChange: (color: CounterColor) => void;
};

export function ColorPicker({value, onChange}: Props) {
  return (
    <div role="radiogroup" aria-label="Counter color" className="flex flex-row flex-wrap gap-3">
      {CounterColorSchema.options.map(color => (
        <button
          key={color}
          type="button"
          role="radio"
          aria-checked={color === value}
          aria-label={COUNTER_COLORS[color].label}
          title={COUNTER_COLORS[color].label}
          onClick={() => onChange(color)}
          className={cn(
            "flex size-8 items-center justify-center rounded-full outline-none touch-manipulation focus-visible:ring-[3px] focus-visible:ring-ring/50",
            COUNTER_COLORS[color].swatch,
            color === value && "ring-2 ring-foreground ring-offset-2 ring-offset-background"
          )}>
          {color === value && <CheckIcon className="size-4 text-black" />}
        </button>
      ))}
    </div>
  );
}
