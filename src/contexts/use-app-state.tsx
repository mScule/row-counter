import { createContext, useContext, useState, type PropsWithChildren } from "react";

type ProjectListMode = {
    kind: "PROJECT_LIST_MODE"
}

type ProjectViewMode = {
    kind: "PROJECT_VIEW_MODE",
    id: string
}

type AppState = {
    mode: ProjectListMode | ProjectViewMode,
    openProjectList: () => void,
    openProjectView: (id: string) => void
}

const AppStateContext = createContext<AppState | undefined>(undefined)

export function AppStateProvider({ children }: PropsWithChildren) {
    const [mode, setMode] = useState<AppState["mode"]>({ kind: "PROJECT_LIST_MODE" })

    const value: AppState = {
        mode,
        openProjectList: () => setMode({ kind: "PROJECT_LIST_MODE" }),
        openProjectView: id => setMode({ kind: "PROJECT_VIEW_MODE", id })
    }

    return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppState() {
    const context = useContext(AppStateContext)

    if (context === undefined)
        throw new Error("useAppState must be used within an AppStateProvider")

    return context
}
