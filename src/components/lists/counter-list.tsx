import {useUpdateCounters} from "@/react-query/hooks/project/use-update-counters";
import {TypographyLead} from "@/shadcn/typography/typography-lead";
import {Button} from "@/shadcn/ui/button";
import {Card, CardContent, CardHeader} from "@/shadcn/ui/card";
import type {AnyCounter} from "@/types/project";
import {stepCounter} from "@/utils/step-counter";
import {counterColor} from "@/utils/counter-colors";
import {cn} from "@/shadcn/utils";
import {MinusIcon, PlusIcon} from "lucide-react";
import {toast} from "sonner";

type Props = {
  projectId: string;
  counters: AnyCounter[];
};

export function CounterList({projectId, counters}: Props) {
  const updateCounters = useUpdateCounters();

  async function step(index: number, step: number) {
    try {
      await updateCounters.mutateAsync({
        id: projectId,
        update: counters => counters.map((counter, i) => (i === index ? stepCounter(counter, step) : counter))
      });
    } catch {
      toast.error(`Error updating counter`);
    }
  }

  if (counters.length === 0) {
    return <TypographyLead>No counters. Add them by updating the project.</TypographyLead>;
  }

  return (
    <div className="flex flex-col gap-2">
      {counters.map((counter, index) => {
        const color = counterColor(counter.color);

        return (
          <Card key={index} className={cn("border-2", color.border)}>
            <CardHeader className={cn("font-semibold [overflow-wrap:anywhere]", color.text)}>{counter.name}</CardHeader>
            <CardContent>
              <div className="flex flex-row justify-between gap-3 items-center">
                <Button
                  className={cn("h-14 w-16 touch-manipulation", color.button)}
                  aria-label={`Decrease ${counter.name}`}
                  onClick={() => step(index, -1)}>
                  <MinusIcon className="size-6" />
                </Button>
                <div className="flex flex-row gap-1 items-baseline">
                  <span className={cn("text-4xl font-bold tabular-nums", color.text)}>{counter.count}</span>
                  {counter.kind === "LIMITED_COUNTER" && (
                    <span className={cn("text-sm font-medium", color.text)}>/ {counter.limit}</span>
                  )}
                </div>
                <Button
                  className={cn("h-14 w-16 touch-manipulation", color.button)}
                  aria-label={`Increase ${counter.name}`}
                  onClick={() => step(index, 1)}>
                  <PlusIcon className="size-6" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
