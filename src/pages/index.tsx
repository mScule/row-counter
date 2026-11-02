import {Logo} from "@/components/logo";
import {ProjectListView} from "@/components/views/project-list-view";
import {ProjectView} from "@/components/views/project-view";
import {useAppState} from "@/contexts/use-app-state";

export function Index() {
  const {mode} = useAppState();

  return (
    <main className="flex flex-col items-center gap-5 py-4">
      <Logo />

      {mode.kind === "PROJECT_LIST_MODE" && <ProjectListView />}
      {mode.kind === "PROJECT_VIEW_MODE" && <ProjectView key={mode.id} id={mode.id} />}
    </main>
  );
}
