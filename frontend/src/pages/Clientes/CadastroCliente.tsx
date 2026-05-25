import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TipoDocumento } from "@/types/enums";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

type FormType = {
  nome: string;
  nomeSocial: string;
  dataNascimento: string;
  tipoDocumento: TipoDocumento | "";
  numeroDocumento: string;
  dataExpedicao: string;
};

type Props = {
  onClose: () => void;
};

export default function CadastroCliente({ onClose }: Props) {
  const { register, handleSubmit, control } = useForm<FormType>({
    defaultValues: {
      nome: "",
      nomeSocial: "",
      dataNascimento: "",
      tipoDocumento: "",
      numeroDocumento: "",
      dataExpedicao: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: FormType) {
    setIsLoading(true);
    console.log(data);
    setIsLoading(false);
    onClose();
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
        <FieldGroup>
          <FieldSet className="@container">
            <FieldLegend>Dados Pessoais</FieldLegend>
            <FieldGroup className="grid grid-cols-1 @sm:grid-cols-2 gap-5">
              <Field>
                <FieldLabel>Nome:</FieldLabel>
                <Input {...register("nome")} placeholder="Nome..." />
              </Field>
              <Field>
                <FieldLabel>Nome Social:</FieldLabel>
                <Input {...register("nomeSocial")} placeholder="Nome social..." />
              </Field>
              <Field>
                <FieldLabel>Data de Nascimento:</FieldLabel>
                <Input type="date" {...register("dataNascimento")} />
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <FieldSet>
            <FieldLegend>Telefone e Endereço</FieldLegend>
            <FieldGroup>
              <Field>
                
              </Field>
              <Field>

              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <FieldSet>
            <FieldLegend>Documento</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel>Tipo Documento</FieldLabel>

                <Controller
                  name="tipoDocumento"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de documento" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value={TipoDocumento.CPF}>{TipoDocumento.CPF}</SelectItem>

                          <SelectItem value={TipoDocumento.RG}>{TipoDocumento.RG}</SelectItem>

                          <SelectItem value={TipoDocumento.Passaporte}>
                            {TipoDocumento.Passaporte}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <FieldGroup className="grid grid-cols-1 @sm:grid-cols-2 gap-5!">
                <Field>
                  <FieldLabel>Número:</FieldLabel>
                  <Input {...register("numeroDocumento")} placeholder="Número do documento..." />
                </Field>
                <Field>
                  <FieldLabel>Data de Expedição:</FieldLabel>
                  <Input {...register("dataExpedicao")} placeholder="Data de expedição..." />
                </Field>
              </FieldGroup>
            </FieldGroup>
          </FieldSet>
          <FieldGroup className="flex flex-row gap-4 *:flex-1">
            <span></span>
            <Button type="button" variant={"outline"} onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{isLoading ? "carregando..." : "Cadastrar"}</Button>
          </FieldGroup>
        </FieldGroup>
      </form>
    </>
  );
}
