import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { PostClienteTitularReq } from "@/types/requests";

export default function TelefonesFieldArray() {
  const { register, control } = useFormContext<PostClienteTitularReq>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "telefones",
  });

  return (
    <FieldGroup className="flex flex-col gap-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-row gap-5 items-end">
          <Field className="flex-1">
            <FieldLabel>DDD:</FieldLabel>
            <Input {...register(`telefones.${index}.ddd`)} type="number" placeholder="DDD..." />
          </Field>
          <Field className="flex-3">
            <FieldLabel>numero:</FieldLabel>
            <Input
              {...register(`telefones.${index}.numero`)}
              type="number"
              placeholder="Número de celular..."
            />
          </Field>
          {fields.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive mb-0.5"
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
        <Plus className="size-4 mr-1" />
        Adicionar telefone
      </Button>
    </FieldGroup>
  );
}
