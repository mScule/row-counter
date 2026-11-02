import {Controller, useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Field, FieldGroup, FieldLabel} from "@/shadcn/ui/field";
import {Input} from "@/shadcn/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/shadcn/ui/select";
import {Button} from "@/shadcn/ui/button";
import z from "zod";
import type {KeyboardEvent} from "react";
import {PlusIcon} from "lucide-react";
import {PositiveIntegerSchema} from "@/form-value-schemas/positive-integer-schema";
import {NonNegativeIntegerSchema} from "@/form-value-schemas/non-negative-integer-schema";
import {NameSchema} from "@/form-value-schemas/name-schema";
import type {AnyCounter} from "@/types/project";
import {CounterColorSchema} from "@/types/counter";
import {DEFAULT_COUNTER_COLOR} from "@/utils/counter-colors";
import {ColorPicker} from "../color-picker";
import {LimitHint} from "../hints/limit-hint";
import {InitialCountHint} from "../hints/initial-count-hint";
import {FieldError} from "../field-error";

const CounterCreationFormSchema = z
  .object({
    name: NameSchema,
    kind: z.enum(["COUNTER", "LIMITED_COUNTER"]),
    limit: z.string(),
    count: z.literal("").or(NonNegativeIntegerSchema),
    color: CounterColorSchema
  })
  .refine(v => v.kind !== "LIMITED_COUNTER" || PositiveIntegerSchema.safeParse(v.limit).success, {
    error: "Value has to be a positive integer",
    path: ["limit"]
  })
  .refine(v => v.kind !== "LIMITED_COUNTER" || !(Number(v.limit) > 0) || Number(v.count) < Number(v.limit), {
    error: "Initial count must be smaller than limit",
    path: ["count"]
  });

type Props = {
  onCreate: (counter: AnyCounter) => void;
};

// Rendered inside the project modification form, so it can't be a <form> of its own
export function CounterCreationForm({onCreate}: Props) {
  const form = useForm({
    resolver: zodResolver(CounterCreationFormSchema),
    defaultValues: {
      name: "",
      kind: "COUNTER" as const,
      limit: "",
      count: "",
      color: DEFAULT_COUNTER_COLOR
    }
  });

  const kind = useWatch({control: form.control, name: "kind"});

  function submitCreateCounter(data: z.infer<typeof CounterCreationFormSchema>) {
    const count = Number(data.count);

    onCreate(
      data.kind === "LIMITED_COUNTER"
        ? {kind: "LIMITED_COUNTER", name: data.name, count, color: data.color, limit: Number(data.limit)}
        : {kind: "COUNTER", name: data.name, count, color: data.color}
    );
    form.reset();
  }

  // Enter would otherwise submit the surrounding project form
  function submitOnEnter(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
      event.preventDefault();
      form.handleSubmit(submitCreateCounter)();
    }
  }

  return (
    <FieldGroup className="gap-3" onKeyDown={submitOnEnter}>
      <Controller
        control={form.control}
        name="name"
        render={({field, fieldState}) => (
          <>
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Counter name</FieldLabel>
              <Input placeholder="Rows" {...field} />
            </Field>
            {fieldState.error && <FieldError message={fieldState.error.message} />}
          </>
        )}
      />
      <Controller
        control={form.control}
        name="kind"
        render={({field}) => (
          <Field>
            <FieldLabel>Counter type</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COUNTER">Counter</SelectItem>
                <SelectItem value="LIMITED_COUNTER">Repeating counter (with limit)</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        )}
      />
      {kind === "LIMITED_COUNTER" && (
        <Controller
          control={form.control}
          name="limit"
          render={({field, fieldState}) => (
            <>
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Limit</FieldLabel>
                <LimitHint />
                <Input placeholder="For example 8" {...field} />
              </Field>
              {fieldState.error && <FieldError message={fieldState.error.message} />}
            </>
          )}
        />
      )}
      <Controller
        control={form.control}
        name="count"
        render={({field, fieldState}) => (
          <>
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Initial count</FieldLabel>
              <InitialCountHint />
              <Input placeholder="0" {...field} />
            </Field>
            {fieldState.error && <FieldError message={fieldState.error.message} />}
          </>
        )}
      />
      <Controller
        control={form.control}
        name="color"
        render={({field}) => (
          <Field>
            <FieldLabel>Color</FieldLabel>
            <ColorPicker value={field.value} onChange={field.onChange} />
          </Field>
        )}
      />
      <Button variant="outline" type="button" onClick={form.handleSubmit(submitCreateCounter)}>
        <span>Add counter</span>
        <PlusIcon />
      </Button>
    </FieldGroup>
  );
}
