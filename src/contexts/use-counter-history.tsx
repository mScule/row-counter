import {createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren} from "react";

import type {AnyCounter} from "@/types/project";

export type CounterHistoryEntry = {
  id: string;
  timestamp: number;
  label: string;
  before: AnyCounter[];
  after: AnyCounter[];
};

type CounterHistory = {
  getEntries: (projectId: string) => CounterHistoryEntry[];
  addEntry: (projectId: string, entry: Omit<CounterHistoryEntry, "id" | "timestamp">) => void;
};

const MAX_ENTRIES_PER_PROJECT = 200;

const EMPTY: CounterHistoryEntry[] = [];

const CounterHistoryContext = createContext<CounterHistory | undefined>(undefined);

// Session-only history of counter changes. Kept in memory on purpose so the stored data model is untouched
export function CounterHistoryProvider({children}: PropsWithChildren) {
  const [entries, setEntries] = useState<Record<string, CounterHistoryEntry[]>>({});

  const getEntries = useCallback((projectId: string) => entries[projectId] ?? EMPTY, [entries]);

  const addEntry = useCallback<CounterHistory["addEntry"]>((projectId, entry) => {
    setEntries(previous => {
      const list = [
        ...(previous[projectId] ?? []),
        {...entry, id: crypto.randomUUID(), timestamp: Date.now()}
      ].slice(-MAX_ENTRIES_PER_PROJECT);

      return {...previous, [projectId]: list};
    });
  }, []);

  const value = useMemo(() => ({getEntries, addEntry}), [getEntries, addEntry]);

  return <CounterHistoryContext.Provider value={value}>{children}</CounterHistoryContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCounterHistory() {
  const context = useContext(CounterHistoryContext);

  if (context === undefined) throw new Error("useCounterHistory must be used within a CounterHistoryProvider");

  return context;
}
