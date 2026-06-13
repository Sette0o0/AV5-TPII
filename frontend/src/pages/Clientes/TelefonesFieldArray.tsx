import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ClientePayload } from "@/types/requests";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function TelefonesFieldArray() {
  const { register, control } = useFormContext<ClientePayload>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "telefones",
  });

  return (
    <FieldGroup className="flex flex-col gap-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-row items-end gap-5">
          <Field className="flex-1">
            <FieldLabel>DDD</FieldLabel>
            <Input {...register(`telefones.${index}.ddd`)} type="number" placeholder="DDD" />
          </Field>
          <Field className="flex-3">
            <FieldLabel>Numero</FieldLabel>
            <Input
              {...register(`telefones.${index}.numero`)}
              type="number"
              placeholder="Numero de celular"
            />
          </Field>
          {fields.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mb-0.5 text-destructive hover:text-destructive"
              onClick={() => remove(index)}
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        onClick={() => append({ ddd: "", numero: "" })}
      >
        <Plus className="size-4" />
        Adicionar telefone
      </Button>
    </FieldGroup>
  );
}
