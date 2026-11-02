import z from "zod";

import {useState} from "react";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {toast} from "sonner";

import {Input} from "@/shadcn/ui/input";
import {Button} from "@/shadcn/ui/button";
import {Separator} from "@/shadcn/ui/separator";
import {Field, FieldGroup, FieldLabel} from "@/shadcn/ui/field";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/shadcn/ui/dialog";
import {TypographySmall} from "@/shadcn/typography/typography-small";

import type {WithId} from "@/types/with-id";
import type {AnyCounter, Project} from "@/types/project";
import {useUpdateProject} from "@/react-query/hooks/project/use-update-project";
import {NameSchema} from "@/form-value-schemas/name-schema";
import {ArrowDownIcon, ArrowUpIcon, PenIcon, TrashIcon} from "lucide-react";
import {FieldError} from "../field-error";
import {CounterCreationForm} from "./counter-creation-form";
import {ColorPicker} from "../color-picker";
import type {CounterColor} from "@/types/counter";
import {DEFAULT_COUNTER_COLOR} from "@/utils/counter-colors";

const FormSchema = z.object({
  name: NameSchema
});

type Props = {
  project: WithId<Project>;
};

export function ProjectModificationForm({project}: Props) {
  const updateProject = useUpdateProject();

  const [isOpen, setIsOpen] = useState(false);

  // Counter changes are collected here and saved together with the name
  const [counters, setCounters] = useState<AnyCounter[]>(project.counters);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: project.name
    }
  });

  function changeIsOpen(isOpen: boolean) {
    if (isOpen) {
      form.reset({name: project.name});
      setCounters(project.counters);
    }
    setIsOpen(isOpen);
  }

  function moveCounter(index: number, step: number) {
    const moved = [...counters];
    [moved[index], moved[index + step]] = [moved[index + step], moved[index]];
    setCounters(moved);
  }

  function changeCounterColor(index: number, color: CounterColor) {
    setCounters(counters.map((counter, i) => (i === index ? {...counter, color} : counter)));
  }

  async function submitUpdateProject(data: z.infer<typeof FormSchema>) {
    try {
      await updateProject.mutateAsync({
        id: project.id,
        project: {name: data.name, counters}
      });
      toast.success(`Project ${data.name} updated`);
      setIsOpen(false);
    } catch {
      toast.error(`Error updating project`);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={changeIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PenIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update {project.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(submitUpdateProject)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({field, fieldState}) => (
                <>
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Name</FieldLabel>
                    <Input placeholder={project.name} {...field} />
                  </Field>
                  {fieldState.error && <FieldError message={fieldState.error.message} />}
                </>
              )}
            />

            <Field>
              <FieldLabel>Counters</FieldLabel>
              {counters.length === 0 && <TypographySmall>No counters</TypographySmall>}
              {counters.map((counter, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex flex-row justify-between gap-3 items-center">
                    <TypographySmall>
                      <span className="[overflow-wrap:anywhere]">
                        {counter.name}: {counter.count}
                        {counter.kind === "LIMITED_COUNTER" && ` / ${counter.limit}`}
                      </span>
                    </TypographySmall>
                    <div className="flex flex-row gap-1 shrink-0">
                      <Button
                        variant="outline"
                        type="button"
                        aria-label={`Move ${counter.name} up`}
                        disabled={index === 0}
                        onClick={() => moveCounter(index, -1)}>
                        <ArrowUpIcon />
                      </Button>
                      <Button
                        variant="outline"
                        type="button"
                        aria-label={`Move ${counter.name} down`}
                        disabled={index === counters.length - 1}
                        onClick={() => moveCounter(index, 1)}>
                        <ArrowDownIcon />
                      </Button>
                      <Button
                        variant="outline"
                        type="button"
                        aria-label={`Delete ${counter.name}`}
                        onClick={() => setCounters(counters.filter((_, i) => i !== index))}>
                        <TrashIcon />
                      </Button>
                    </div>
                  </div>
                  <ColorPicker
                    value={counter.color ?? DEFAULT_COUNTER_COLOR}
                    onChange={color => changeCounterColor(index, color)}
                  />
                </div>
              ))}
            </Field>

            <Separator />
            <CounterCreationForm onCreate={counter => setCounters([...counters, counter])} />
            <Separator />

            <Button variant="outline" type="submit">
              <span>Update</span>
              <PenIcon />
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
