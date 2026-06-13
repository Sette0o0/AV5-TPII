import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { normalizarString } from "@/lib/utils";
import {
  cadastrarDependente,
  editarCliente,
  excluirCliente,
  listarClientes,
} from "@/services/Clientes";
import { TiposDocumentoEnum } from "@/types/enums";
import type { ClientePayload, DependentePayload } from "@/types/requests";
import type { GetClientesRes } from "@/types/responses";
import { Edit, Plus, Trash2, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import CadastroCliente from "./CadastroCliente";

const documentoOptions = [
  { value: TiposDocumentoEnum.cpf, label: "CPF" },
  { value: TiposDocumentoEnum.rg, label: "RG" },
  { value: TiposDocumentoEnum.passaporte, label: "Passaporte" },
];

function Clientes() {
  const [clientes, setClientes] = useState<GetClientesRes[]>([]);
  const [search, setSearch] = useState("");
  const [openCadastro, setOpenCadastro] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<GetClientesRes | null>(null);
  const [titularDependente, setTitularDependente] = useState<GetClientesRes | null>(null);
  const [loading, setLoading] = useState(true);

  async function carregarClientes() {
    try {
      setLoading(true);
      setClientes((await listarClientes()) ?? []);
    } catch (error) {
      console.error("Erro ao carregar clientes.", error);
    } finally {
      setLoading(false);
    }
  }

  async function salvarEdicao(payload: ClientePayload) {
    if (!clienteEditando) return;

    await editarCliente(clienteEditando.id, payload);
    await carregarClientes();
  }

  async function removerCliente(cliente: GetClientesRes) {
    const confirmado = window.confirm(`Excluir ${cliente.nome}?`);

    if (!confirmado) return;

    await excluirCliente(cliente.id);
    await carregarClientes();
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
          <Button className="sm:mr-auto" onClick={() => setOpenCadastro(true)}>
            <Plus />
            Cliente
          </Button>

          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Pesquisar cliente"
            className="w-full sm:max-w-lg"
          />
        </div>

        {loading ? (
          <div className="rounded-md border p-6 text-center text-muted-foreground">Carregando...</div>
        ) : (
          <ListaClientes
            clientes={clientes}
            search={search}
            onEdit={setClienteEditando}
            onDelete={removerCliente}
            onAddDependente={setTitularDependente}
          />
        )}
      </div>

      <Modal
        open={openCadastro}
        setOpen={setOpenCadastro}
        title="Cadastro de cliente"
        className="min-w-lg"
      >
        <CadastroCliente
          onClose={() => {
            setOpenCadastro(false);
            carregarClientes();
          }}
        />
      </Modal>

      <Modal
        open={!!clienteEditando}
        setOpen={(open) => !open && setClienteEditando(null)}
        title="Editar cliente"
        className="min-w-lg"
      >
        <CadastroCliente
          cliente={clienteEditando}
          onSubmitForm={salvarEdicao}
          onClose={() => {
            setClienteEditando(null);
            carregarClientes();
          }}
        />
      </Modal>

      <Modal
        open={!!titularDependente}
        setOpen={(open) => !open && setTitularDependente(null)}
        title="Cadastrar dependente"
        className="min-w-lg"
      >
        {titularDependente && (
          <DependenteForm
            titular={titularDependente}
            onClose={() => setTitularDependente(null)}
            onSaved={carregarClientes}
          />
        )}
      </Modal>
    </>
  );
}

type ListaClientesProps = {
  clientes: GetClientesRes[];
  search: string;
  onEdit: (cliente: GetClientesRes) => void;
  onDelete: (cliente: GetClientesRes) => void;
  onAddDependente: (cliente: GetClientesRes) => void;
};

function ListaClientes({ clientes, search, onEdit, onDelete, onAddDependente }: ListaClientesProps) {
  const clientesFiltrados = useMemo(() => {
    return clientes.filter((cliente) => {
      const termo = `${cliente.nome} ${cliente.nomeSocial} ${cliente.titular?.nome ?? ""}`;

      return normalizarString(termo).includes(normalizarString(search));
    });
  }, [clientes, search]);

  if (!clientesFiltrados.length) {
    return <div className="rounded-md border p-6 text-center">Nenhum cliente encontrado</div>;
  }

  return (
    <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
      {clientesFiltrados.map((cliente) => (
        <Card key={cliente.id} className="gap-4">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <CardTitle className="truncate">{cliente.nome}</CardTitle>
                <CardDescription>{cliente.nomeSocial || "Sem nome social"}</CardDescription>
              </div>
              <div className="flex gap-1">
                <Button size="icon-sm" variant="ghost" title="Editar" onClick={() => onEdit(cliente)}>
                  <Edit />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  title="Adicionar dependente"
                  onClick={() => onAddDependente(cliente)}
                  disabled={!!cliente.titularId}
                >
                  <UserPlus />
                </Button>
                <Button
                  size="icon-sm"
                  variant="destructive"
                  title="Excluir"
                  onClick={() => onDelete(cliente)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <Info label="Endereco" value={`${cliente.endereco.cidade} - ${cliente.endereco.estado}`} />
            <Info
              label="Telefones"
              value={cliente.telefones.map((telefone) => `(${telefone.ddd}) ${telefone.numero}`).join(", ")}
            />
            {cliente.dependentes.length > 0 && (
              <Info
                label="Dependentes"
                value={cliente.dependentes.map((dependente) => dependente.nome).join(", ")}
              />
            )}
            {cliente.titular && <Info label="Titular" value={cliente.titular.nome} />}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="shrink-0 text-muted-foreground">{label}:</span>
      <span className="min-w-0 truncate pl-2 text-xs my-auto" title={value}>
        {value || "-"}
      </span>
    </div>
  );
}

function DependenteForm({
  titular,
  onClose,
  onSaved,
}: {
  titular: GetClientesRes;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, control, handleSubmit } = useForm<DependentePayload>({
    defaultValues: {
      nome: "",
      nomeSocial: "",
      dataNascimento: "",
      documentos: [
        {
          numero: "",
          tipo: TiposDocumentoEnum.cpf,
          dataExpedicao: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "documentos",
  });

  async function onSubmit(data: DependentePayload) {
    if (isLoading) return;

    try {
      setIsLoading(true);
      await cadastrarDependente(titular.id, data);
      await onSaved();
      onClose();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FieldSet>
        <FieldLegend>Titular: {titular.nome}</FieldLegend>
        <FieldGroup className="grid grid-cols-1 gap-5 @sm:grid-cols-2">
          <Field>
            <FieldLabel>Nome</FieldLabel>
            <Input {...register("nome")} />
          </Field>
          <Field>
            <FieldLabel>Nome social</FieldLabel>
            <Input {...register("nomeSocial")} />
          </Field>
          <Field>
            <FieldLabel>Data de nascimento</FieldLabel>
            <Input type="date" {...register("dataNascimento")} />
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Documentos</FieldLegend>
        <FieldGroup className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 items-end gap-3 rounded-md border p-3 @sm:grid-cols-[1fr_1fr_1fr_auto]">
              <Field>
                <FieldLabel>Tipo</FieldLabel>
                <Controller
                  control={control}
                  name={`documentos.${index}.tipo`}
                  render={({ field: controllerField }) => (
                    <Select onValueChange={controllerField.onChange} value={controllerField.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {documentoOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <Field>
                <FieldLabel>Numero</FieldLabel>
                <Input type="number" {...register(`documentos.${index}.numero`)} />
              </Field>
              <Field>
                <FieldLabel>Data</FieldLabel>
                <Input type="date" {...register(`documentos.${index}.dataExpedicao`)} />
              </Field>
              {fields.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                  <Trash2 />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="self-start"
            onClick={() =>
              append({
                numero: "",
                tipo: TiposDocumentoEnum.cpf,
                dataExpedicao: "",
              })
            }
          >
            <Plus />
            Documento
          </Button>
        </FieldGroup>
      </FieldSet>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "salvando..." : "Cadastrar"}
        </Button>
      </div>
    </form>
  );
}

export default Clientes;
