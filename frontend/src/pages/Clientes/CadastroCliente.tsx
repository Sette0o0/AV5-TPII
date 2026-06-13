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
import { TiposDocumentoEnum } from "@/types/enums";
import type { PostClienteTitularReq } from "@/types/requests";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import DocumentosFieldArray from "./DocumentosFieldArray";
import TelefonesFieldArray from "./TelefonesFieldArray";
import { cadastrarTitular } from "@/services/Clientes";

type FormType = PostClienteTitularReq;

type Props = {
  onClose: () => void;
};

export default function CadastroCliente({ onClose }: Props) {
  const methods = useForm<FormType>({
    defaultValues: {
      nome: "",
      nomeSocial: "",
      dataNascimento: "",
      endereco: {
        bairro: "",
        cidade: "",
        codigoPostal: "",
        estado: "",
        pais: "",
        rua: "",
      },
      documentos: [
        {
          numero: "",
          tipo: TiposDocumentoEnum.cpf,
          dataExpedicao: "",
        },
      ],
      telefones: [
        {
          ddd: "",
          numero: "",
        },
      ],
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: FormType) {
    if (isLoading) return

    try {
      setIsLoading(true);

      await cadastrarTitular(data);

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col w-full">
        <FieldGroup>
          <FieldSet className="@container">
            <FieldLegend>Dados Pessoais</FieldLegend>
            <FieldGroup className="grid grid-cols-1 @sm:grid-cols-2 gap-5">
              <Field>
                <FieldLabel>Nome:</FieldLabel>
                <Input {...methods.register("nome")} placeholder="Nome..." />
              </Field>
              <Field>
                <FieldLabel>Nome Social:</FieldLabel>
                <Input {...methods.register("nomeSocial")} placeholder="Nome social..." />
              </Field>
              <Field>
                <FieldLabel>Data de Nascimento:</FieldLabel>
                <Input type="date" {...methods.register("dataNascimento")} />
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend>Endereço</FieldLegend>
            <FieldGroup className="grid grid-cols-1 @sm:grid-cols-2 gap-5">
              <Field>
                <FieldLabel>Rua</FieldLabel>
                <Input {...methods.register("endereco.rua")} />
              </Field>
              <Field>
                <FieldLabel>Bairro</FieldLabel>
                <Input {...methods.register("endereco.bairro")} />
              </Field>
              <Field>
                <FieldLabel>Cidade</FieldLabel>
                <Input {...methods.register("endereco.cidade")} />
              </Field>
              <Field>
                <FieldLabel>Estado</FieldLabel>
                <Input {...methods.register("endereco.estado")} />
              </Field>
              <Field>
                <FieldLabel>País</FieldLabel>
                <Input {...methods.register("endereco.pais")} />
              </Field>
              <Field>
                <FieldLabel>CEP</FieldLabel>
                <Input {...methods.register("endereco.codigoPostal")} />
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend>Telefones</FieldLegend>
            <TelefonesFieldArray />
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend>Documentos</FieldLegend>
            <DocumentosFieldArray />
          </FieldSet>

          <FieldGroup className="flex flex-row gap-4 *:flex-1">
            <span></span>
            <Button type="button" variant={"outline"} onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? "carregando..." : "Cadastrar"}</Button>
          </FieldGroup>
        </FieldGroup>
      </form>
    </FormProvider>
  );
}
