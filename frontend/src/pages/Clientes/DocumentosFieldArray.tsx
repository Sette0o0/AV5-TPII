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
import type { ClientePayload } from "@/types/requests";
import { Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form";

const todosTipos = [
  { value: TiposDocumentoEnum.cpf, label: "CPF" },
  { value: TiposDocumentoEnum.rg, label: "RG" },
  { value: TiposDocumentoEnum.passaporte, label: "Passaporte" },
];

const maxDocumentos = 3;

export default function DocumentosFieldArray() {
  const { register, control } = useFormContext<ClientePayload>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "documentos",
  });

  const documentosWatch = useWatch({ control, name: "documentos" });
  const tiposUsados = documentosWatch?.map((documento) => documento?.tipo).filter(Boolean) ?? [];
  const tiposDisponiveis = todosTipos.filter((tipo) => !tiposUsados.includes(tipo.value));

  return (
    <FieldGroup className="flex flex-col gap-4">
      {fields.map((field, index) => {
        const tipoAtual = documentosWatch?.[index]?.tipo;
        const opcoes = todosTipos.filter(
          (tipo) => !tiposUsados.includes(tipo.value) || tipo.value === tipoAtual,
        );

        return (
          <div key={field.id} className="relative flex flex-col gap-3 rounded-md border p-3">
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
              <FieldLabel>Tipo de documento</FieldLabel>
              <Controller
                name={`documentos.${index}.tipo`}
                control={control}
                render={({ field: controllerField }) => (
                  <Select onValueChange={controllerField.onChange} value={controllerField.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {opcoes.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <FieldGroup className="grid grid-cols-1 gap-5! @sm:grid-cols-2">
              <Field>
                <FieldLabel>Numero</FieldLabel>
                <Input
                  {...register(`documentos.${index}.numero`)}
                  type="number"
                  placeholder="Numero do documento"
                />
              </Field>
              <Field>
                <FieldLabel>Data de expedicao</FieldLabel>
                <Input {...register(`documentos.${index}.dataExpedicao`)} type="date" />
              </Field>
            </FieldGroup>
          </div>
        );
      })}

      {fields.length < maxDocumentos && tiposDisponiveis.length > 0 && (
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
          <Plus className="size-4" />
          Adicionar documento
        </Button>
      )}
    </FieldGroup>
  );
}
