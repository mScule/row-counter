import {useState} from "react";
import {useCounterHistory} from "@/contexts/use-counter-history";
import {useUpdateCounters} from "@/react-query/hooks/project/use-update-counters";
import {Button} from "@/shadcn/ui/button";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "@/shadcn/ui/dialog";
import type {AnyCounter} from "@/types/project";
import {stepCounter} from "@/utils/step-counter";
import {HistoryIcon} from "lucide-react";
import {toast} from "sonner";

type Props = {
  projectId: string;
};

type Row = {
  key: string;
  timestamp: number;
  label: string;
  snapshot: AnyCounter[];
};

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString();
}

// Takes only the counts from the snapshot, so counters added or edited with forms after it are kept
function restoreCounts(current: AnyCounter[], snapshot: AnyCounter[]) {
  return current.map((counter, index) => {
    const previous = snapshot[index];

    if (!previous || previous.kind !== counter.kind) {
      return counter;
    }

    return stepCounter({...counter, count: previous.count}, 0);
  });
}

export function CounterHistoryDialog({projectId}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const {getEntries} = useCounterHistory();
  const updateCounters = useUpdateCounters();

  const entries = getEntries(projectId);

  const rows: Row[] = entries
    .map(entry => ({key: entry.id, timestamp: entry.timestamp, label: entry.label, snapshot: entry.after}))
    .reverse();

  if (entries.length > 0) {
    rows.push({key: "session-start", timestamp: entries[0].timestamp, label: "Session start", snapshot: entries[0].before});
  }

  async function restore(row: Row) {
    try {
      await updateCounters.mutateAsync({
        id: projectId,
        label: `Restored to ${row.key === "session-start" ? "session start" : formatTime(row.timestamp)}`,
        update: counters => restoreCounts(counters, row.snapshot)
      });

      setIsOpen(false);
    } catch {
      toast.error(`Error restoring counters`);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={isOpen => setIsOpen(isOpen)}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label="History" disabled={entries.length === 0}>
          <HistoryIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>History</DialogTitle>
          <DialogDescription>Changes made during this session. Restore to go back to an earlier state.</DialogDescription>
        </DialogHeader>
        <ul className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto">
          {rows.map((row, index) => (
            <li key={row.key} className="flex flex-row justify-between items-center gap-3 rounded-md border px-3 py-2">
              <div className="flex flex-col min-w-0">
                <span className="font-medium [overflow-wrap:anywhere]">{row.label}</span>
                <span className="text-sm text-muted-foreground tabular-nums">{formatTime(row.timestamp)}</span>
              </div>
              {index === 0 ? (
                <span className="text-sm text-muted-foreground shrink-0">Current</span>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={updateCounters.isPending}
                  onClick={() => restore(row)}>
                  Restore
                </Button>
              )}
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
