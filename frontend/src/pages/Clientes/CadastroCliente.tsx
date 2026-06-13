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
import { cadastrarTitular } from "@/services/Clientes";
import type { ClientePayload } from "@/types/requests";
import type { GetClientesRes } from "@/types/responses";
import { TiposDocumentoEnum } from "@/types/enums";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import DocumentosFieldArray from "./DocumentosFieldArray";
import TelefonesFieldArray from "./TelefonesFieldArray";

type FormType = ClientePayload;

type Props = {
  onClose: () => void;
  cliente?: GetClientesRes | null;
  onSubmitForm?: (data: FormType) => Promise<void>;
};

const emptyCliente: FormType = {
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
};

function toDateInput(value: string) {
  return value ? value.slice(0, 10) : "";
}

function clienteToForm(cliente?: GetClientesRes | null): FormType {
  if (!cliente) {
    return emptyCliente;
  }

  return {
    nome: cliente.nome,
    nomeSocial: cliente.nomeSocial,
    dataNascimento: toDateInput(cliente.dataNascimento),
    endereco: {
      bairro: cliente.endereco.bairro,
      cidade: cliente.endereco.cidade,
      codigoPostal: cliente.endereco.codigoPostal,
      estado: cliente.endereco.estado,
      pais: cliente.endereco.pais,
      rua: cliente.endereco.rua,
    },
    documentos:
      cliente.documentos.length > 0
        ? cliente.documentos.map((documento) => ({
            numero: documento.numero,
            tipo: documento.tipo,
            dataExpedicao: toDateInput(documento.dataExpedicao),
          }))
        : emptyCliente.documentos,
    telefones:
      cliente.telefones.length > 0
        ? cliente.telefones.map((telefone) => ({
            ddd: telefone.ddd,
            numero: telefone.numero,
          }))
        : emptyCliente.telefones,
  };
}

export default function CadastroCliente({ onClose, cliente, onSubmitForm }: Props) {
  const methods = useForm<FormType>({
    defaultValues: clienteToForm(cliente),
  });

  const [isLoading, setIsLoading] = useState(false);
  const submitLabel = cliente ? "Salvar" : "Cadastrar";

  useEffect(() => {
    methods.reset(clienteToForm(cliente));
  }, [cliente, methods]);

  async function onSubmit(data: FormType) {
    if (isLoading) return;

    try {
      setIsLoading(true);

      if (onSubmitForm) {
        await onSubmitForm(data);
      } else {
        await cadastrarTitular(data);
      }

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex w-full flex-col">
        <FieldGroup>
          <FieldSet className="@container">
            <FieldLegend>Dados pessoais</FieldLegend>
            <FieldGroup className="grid grid-cols-1 gap-5 @sm:grid-cols-2">
              <Field>
                <FieldLabel>Nome</FieldLabel>
                <Input {...methods.register("nome")} placeholder="Nome" />
              </Field>
              <Field>
                <FieldLabel>Nome social</FieldLabel>
                <Input {...methods.register("nomeSocial")} placeholder="Nome social" />
              </Field>
              <Field>
                <FieldLabel>Data de nascimento</FieldLabel>
                <Input type="date" {...methods.register("dataNascimento")} />
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend>Endereco</FieldLegend>
            <FieldGroup className="grid grid-cols-1 gap-5 @sm:grid-cols-2">
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
                <FieldLabel>Pais</FieldLabel>
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
            <span />
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "carregando..." : submitLabel}
            </Button>
          </FieldGroup>
        </FieldGroup>
      </form>
    </FormProvider>
  );
}
