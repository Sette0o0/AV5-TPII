import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TiposDocumentoEnum } from "@/types/enums";
import type { PostClienteTitularReq } from "@/types/requests";
import { Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form";

const TODOS_TIPOS = [
  { value: TiposDocumentoEnum.cpf, label: "CPF" },
  { value: TiposDocumentoEnum.rg, label: "RG" },
  { value: TiposDocumentoEnum.passaporte, label: "Passaporte" },
];

const MAX_DOCUMENTOS = 3;

export default function DocumentosFieldArray() {
  const { register, control } = useFormContext<PostClienteTitularReq>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "documentos",
  });

  const documentosWatch = useWatch({ control, name: "documentos" });
  const tiposUsados = documentosWatch?.map((d) => d?.tipo).filter(Boolean) ?? [];

  const tiposDisponiveis = TODOS_TIPOS.filter((t) => !tiposUsados.includes(t.value));

  return (
    <FieldGroup className="flex flex-col gap-4">
      {fields.map((field, index) => {
        const tipoAtual = documentosWatch?.[index]?.tipo;
        const opcoes = TODOS_TIPOS.filter(
          (t) => !tiposUsados.includes(t.value) || t.value === tipoAtual,
        );

        return (
          <div key={field.id} className="flex flex-col gap-3 p-3 border rounded-md relative">
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive hover:text-destructive"
                onClick={() => remove(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            )}

            <Field>
              <FieldLabel>Tipo Documento</FieldLabel>
              <Controller
                name={`documentos.${index}.tipo`}
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de documento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {opcoes.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <FieldGroup className="grid grid-cols-1 @sm:grid-cols-2 gap-5!">
              <Field>
                <FieldLabel>Número:</FieldLabel>
                <Input
                  {...register(`documentos.${index}.numero`)}
                  type="number"
                  placeholder="Número do documento..."
                />
              </Field>
              <Field>
                <FieldLabel>Data de Expedição:</FieldLabel>
                <Input {...register(`documentos.${index}.dataExpedicao`)} type="date" />
              </Field>
            </FieldGroup>
          </div>
        );
      })}

      {fields.length < MAX_DOCUMENTOS && tiposDisponiveis.length > 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() =>
            append({
              numero: "",
              tipo: tiposDisponiveis[0].value,
              dataExpedicao: "",
            })
          }
        >
          <Plus className="size-4 mr-1" />
          Adicionar documento
        </Button>
      )}
    </FieldGroup>
  );
}
