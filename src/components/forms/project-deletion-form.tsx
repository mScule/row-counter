import {useState} from "react";
import {toast} from "sonner";
import {Button} from "@/shadcn/ui/button";
import {FieldGroup} from "@/shadcn/ui/field";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/shadcn/ui/dialog";
import type {WithId} from "@/types/with-id";
import type {Project} from "@/types/project";
import {TrashIcon} from "lucide-react";
import {useDeleteProject} from "@/react-query/hooks/project/use-delete-project";
import {TypographyP} from "@/shadcn/typography/typography-p";

type Props = {
  project: WithId<Project>;
};

export function ProjectDeletionForm({project}: Props) {
  const deleteProject = useDeleteProject();

  const [isOpen, setIsOpen] = useState(false);

  async function submitDeleteProject() {
    try {
      await deleteProject.mutateAsync({id: project.id});
      toast.success(`Project ${project.name} deleted`);
      setIsOpen(false);
    } catch {
      toast.error(`Error deleting project`);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={isOpen => setIsOpen(isOpen)}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <TrashIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {project.name}</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <TypographyP>
            Do you want to delete <b className="text-destructive">{project.name}</b> ?
          </TypographyP>
          <Button variant="outline" type="submit" onClick={submitDeleteProject}>
            <span>Delete</span>
            <TrashIcon />
          </Button>
        </FieldGroup>
      </DialogContent>
    </Dialog>
  );
}
