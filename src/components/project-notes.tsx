import {useCallback, useEffect, useState} from "react";
import {toast} from "sonner";
import {useUpdateProject} from "@/react-query/hooks/project/use-update-project";
import {Field, FieldLabel} from "@/shadcn/ui/field";
import {Textarea} from "@/shadcn/ui/textarea";
import type {WithId} from "@/types/with-id";
import type {Project} from "@/types/project";

type Props = {
  project: WithId<Project>;
};

const SAVE_DELAY_MS = 500;

export function ProjectNotes({project}: Props) {
  const updateProject = useUpdateProject();
  const {mutateAsync} = updateProject;

  const [notes, setNotes] = useState(project.notes);

  const saveNotes = useCallback(async () => {
    if (notes === project.notes) {
      return;
    }

    try {
      await mutateAsync({id: project.id, project: {notes}});
    } catch {
      toast.error(`Error saving notes`);
    }
  }, [notes, project.id, project.notes, mutateAsync]);

  // Save after user stops typing for a moment
  useEffect(() => {
    const timeout = setTimeout(saveNotes, SAVE_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [saveNotes]);

  return (
    <Field>
      <FieldLabel>Notes</FieldLabel>
      <Textarea
        className="min-h-32"
        placeholder="Needles, yarn, pattern notes..."
        value={notes}
        onChange={event => setNotes(event.target.value)}
        onBlur={saveNotes}
      />
    </Field>
  );
}
