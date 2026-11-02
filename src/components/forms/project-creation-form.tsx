import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useCreateProject} from "@/react-query/hooks/project/use-create-project";
import {toast} from "sonner";
import {Field, FieldGroup, FieldLabel} from "@/shadcn/ui/field";
import {Input} from "@/shadcn/ui/input";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/shadcn/ui/dialog";
import {Button} from "@/shadcn/ui/button";
import z from "zod";
import {useState} from "react";
import {PlusIcon} from "lucide-react";
import {NameSchema} from "@/form-value-schemas/name-schema";
import {FieldError} from "../field-error";
import {DEFAULT_COUNTER_COLOR} from "@/utils/counter-colors";

const ProjectCreationFormSchema = z.object({
  name: NameSchema
});

export function ProjectCreationForm() {
  const createProject = useCreateProject();

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(ProjectCreationFormSchema),
    defaultValues: {
      name: ""
    }
  });

  async function submitCreateProject(project: z.infer<typeof ProjectCreationFormSchema>) {
    try {
      const created = await createProject.mutateAsync({
        project: {
          name: project.name,
          counters: [{kind: "COUNTER", name: "Rows", count: 0, color: DEFAULT_COUNTER_COLOR}],
          notes: ""
        }
      });
      toast.success(`Project ${created.name} added`);
      form.reset();
      setIsOpen(false);
    } catch {
      toast.error(`Error creating project`);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={isOpen => setIsOpen(isOpen)}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <span>Add new</span>
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new project</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(submitCreateProject)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({field, fieldState}) => (
                <>
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Name</FieldLabel>
                    <Input placeholder="Wool socks" {...field} />
                  </Field>
                  {fieldState.error && <FieldError message={fieldState.error.message} />}
                </>
              )}
            />
            <Button variant="outline" type="submit">
              <span>Add new</span>
              <PlusIcon />
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
