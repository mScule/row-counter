import {useQueryAllProjects} from "@/react-query/hooks/project/use-query-all-projects";
import {useAppState} from "@/contexts/use-app-state";
import {TypographyLead} from "@/shadcn/typography/typography-lead";
import {TypographyP} from "@/shadcn/typography/typography-p";
import {Button} from "@/shadcn/ui/button";
import {Card, CardContent, CardHeader} from "@/shadcn/ui/card";
import {SpoolIcon} from "lucide-react";
import {ProjectModificationForm} from "@/components/forms/project-modification-form";
import {ProjectDeletionForm} from "@/components/forms/project-deletion-form";

export function ProjectList() {
  const projects = useQueryAllProjects();
  const {openProjectView} = useAppState();

  if (!projects.data || projects.data.length === 0) {
    return <TypographyLead>No projects</TypographyLead>;
  }

  return (
    <div className="flex flex-col gap-2">
      {projects.data.map(project => (
        <Card key={project.id}>
          <CardHeader className="[overflow-wrap:anywhere]">{project.name}</CardHeader>
          <CardContent>
            <div className="flex flex-row flex-wrap justify-between gap-3 items-center">
              <TypographyP>
                {project.counters.length} {project.counters.length === 1 ? "counter" : "counters"}
              </TypographyP>
              <div className="flex flex-row gap-3">
                <Button variant="outline" onClick={() => openProjectView(project.id)}>
                  Open <SpoolIcon />
                </Button>
                <ProjectModificationForm project={project} />
                <ProjectDeletionForm project={project} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
