import {useAppState} from "@/contexts/use-app-state";
import {CounterList} from "@/components/lists/counter-list";
import {CounterHistoryDialog} from "@/components/counter-history-dialog";
import {ProjectNotes} from "@/components/project-notes";
import {useQueryProject} from "@/react-query/hooks/project/use-query-project";
import {TypographyH2} from "@/shadcn/typography/typography-h2";
import {TypographyLead} from "@/shadcn/typography/typography-lead";
import {Button} from "@/shadcn/ui/button";
import {ArrowLeftIcon} from "lucide-react";

type Props = {
  id: string;
};

export function ProjectView({id}: Props) {
  const {openProjectList} = useAppState();
  const project = useQueryProject(id);

  return (
    <div className="flex flex-col gap-3 px-2 w-full max-w-2xl">
      <div className="flex flex-row gap-5 justify-between items-center w-full">
        <div className="min-w-0 [overflow-wrap:anywhere]">
          <TypographyH2>{project.data?.name ?? "Project"}</TypographyH2>
        </div>
        <div className="flex flex-row gap-2 shrink-0">
          <CounterHistoryDialog projectId={id} />
          <Button variant="outline" onClick={openProjectList}>
            <ArrowLeftIcon />
            <span>Projects</span>
          </Button>
        </div>
      </div>

      {project.isSuccess && !project.data && <TypographyLead>Project not found</TypographyLead>}

      {project.data && (
        <>
          <CounterList projectId={project.data.id} counters={project.data.counters} />
          <ProjectNotes project={project.data} />
        </>
      )}
    </div>
  );
}
