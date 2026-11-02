import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Index } from "./pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./shadcn/ui/sonner";
import { ThemeProvider } from "./components/theme-provider";
import { AppStateProvider } from "./contexts/use-app-state";

import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppStateProvider>
          <Index />
        </AppStateProvider>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
