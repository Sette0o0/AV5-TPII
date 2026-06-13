import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { listarAcomodacoes } from "@/services/Acomodacoes";
import { listarClientes } from "@/services/Clientes";
import {
  cadastrarHospedagem,
  editarHospedagem,
  encerrarHospedagem,
  excluirHospedagem,
  listarHospedagens,
} from "@/services/Hospedagens";
import type { Acomodacao, Hospedagem } from "@/types/entidades";
import type { HospedagemPayload } from "@/types/requests";
import type { GetClientesRes } from "@/types/responses";
import type { AxiosError } from "axios";
import { BedDouble, Edit, LogOut, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const acomodacaoLabels: Record<string, string> = {
  solteiro_simples: "Solteiro Simples",
  solteiro_mais: "Solteiro Mais",
  casal_simples: "Casal Simples",
  familia_simples: "Familia Simples",
  familia_mais: "Familia Mais",
  familia_super: "Familia Super",
};

function Hospedagens() {
  const [hospedagens, setHospedagens] = useState<Hospedagem[]>([]);
  const [clientes, setClientes] = useState<GetClientesRes[]>([]);
  const [acomodacoes, setAcomodacoes] = useState<Acomodacao[]>([]);
  const [apenasAtivas, setApenasAtivas] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [hospedagemEditando, setHospedagemEditando] = useState<Hospedagem | null>(null);
  const [loading, setLoading] = useState(true);

  async function carregarDados(filtroAtivas = apenasAtivas) {
    try {
      setLoading(true);
      const [hospedagensData, clientesData, acomodacoesData] = await Promise.all([
        listarHospedagens(filtroAtivas),
        listarClientes(),
        listarAcomodacoes(),
      ]);

      setHospedagens(hospedagensData);
      setClientes(clientesData ?? []);
      setAcomodacoes(acomodacoesData);
    } finally {
      setLoading(false);
    }
  }

  async function salvarHospedagem(payload: HospedagemPayload) {
    try {
      if (hospedagemEditando) {
        await editarHospedagem(hospedagemEditando.id, payload);
      } else {
        await cadastrarHospedagem(payload);
      }

      await carregarDados();
    } catch (error: any) {
      const erro = error as AxiosError
      // @ts-ignore
      alert(erro.response?.data.message)
    }
  }

  async function finalizarHospedagem(hospedagem: Hospedagem) {
    await encerrarHospedagem(hospedagem.id);
    await carregarDados();
  }

  async function removerHospedagem(hospedagem: Hospedagem) {
    const confirmado = window.confirm("Excluir esta hospedagem?");

    if (!confirmado) return;

    await excluirHospedagem(hospedagem.id);
    await carregarDados();
  }

  function fecharForm() {
    setOpenForm(false);
    setHospedagemEditando(null);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="sm:mr-auto">
            <h1 className="text-xl font-semibold">Hospedagens</h1>
            <p className="text-sm text-muted-foreground">
              Controle de hospedes e quartos ocupados.
            </p>
          </div>

          <Select
            value={apenasAtivas ? "ativas" : "todas"}
            onValueChange={(value) => {
              const novoFiltro = value === "ativas";
              setApenasAtivas(novoFiltro);
              carregarDados(novoFiltro);
            }}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="ativas">Ativas</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => setOpenForm(true)}>
            <Plus />
            Hospedagem
          </Button>
        </div>

        {loading ? (
          <div className="rounded-md border p-6 text-center text-muted-foreground">
            Carregando...
          </div>
        ) : hospedagens.length ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
            {hospedagens.map((hospedagem) => (
              <HospedagemCard
                key={hospedagem.id}
                hospedagem={hospedagem}
                onEdit={(item) => {
                  setHospedagemEditando(item);
                  setOpenForm(true);
                }}
                onCheckout={finalizarHospedagem}
                onDelete={removerHospedagem}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-md border p-6 text-center">Nenhuma hospedagem encontrada</div>
        )}
      </div>

      <Modal
        open={openForm}
        setOpen={(open) => {
          if (!open) fecharForm();
          setOpenForm(open);
        }}
        title={hospedagemEditando ? "Editar hospedagem" : "Cadastrar hospedagem"}
        className="min-w-lg"
      >
        <HospedagemForm
          hospedagem={hospedagemEditando}
          clientes={clientes}
          acomodacoes={acomodacoes}
          onCancel={fecharForm}
          onSaved={async (payload) => {
            await salvarHospedagem(payload);
            fecharForm();
          }}
        />
      </Modal>
    </>
  );
}

function HospedagemCard({
  hospedagem,
  onEdit,
  onCheckout,
  onDelete,
}: {
  hospedagem: Hospedagem;
  onEdit: (hospedagem: Hospedagem) => void;
  onCheckout: (hospedagem: Hospedagem) => void;
  onDelete: (hospedagem: Hospedagem) => void;
}) {
  const ativa = !hospedagem.dataSaida;
  const hospede = hospedagem.cliente?.nome ?? `Cliente ${hospedagem.clienteId}`;
  const acomodacao = labelAcomodacao(
    hospedagem.acomodacao?.nome ?? String(hospedagem.acomodacaoId),
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <BedDouble className="mt-0.5 size-5 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate">{hospede}</CardTitle>
            <CardDescription>{acomodacao}</CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              size="icon-sm"
              variant="ghost"
              title="Editar"
              onClick={() => onEdit(hospedagem)}
            >
              <Edit />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              title="Encerrar"
              disabled={!ativa}
              onClick={() => onCheckout(hospedagem)}
            >
              <LogOut />
            </Button>
            <Button
              size="icon-sm"
              variant="destructive"
              title="Excluir"
              onClick={() => onDelete(hospedagem)}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        <Info label="Entrada" value={formatDate(hospedagem.dataEntrada)} />
        <Info
          label="Saida"
          value={hospedagem.dataSaida ? formatDate(hospedagem.dataSaida) : "Pendente"}
        />
      </CardContent>
    </Card>
  );
}

function HospedagemForm({
  hospedagem,
  clientes,
  acomodacoes,
  onCancel,
  onSaved,
}: {
  hospedagem?: Hospedagem | null;
  clientes: GetClientesRes[];
  acomodacoes: Acomodacao[];
  onCancel: () => void;
  onSaved: (payload: HospedagemPayload) => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const defaultValues = useMemo(
    () => hospedagemToForm(hospedagem, clientes[0]?.id ?? 0, acomodacoes[0]?.id ?? 0),
    [acomodacoes, clientes, hospedagem],
  );
  const { register, control, handleSubmit } = useForm<HospedagemPayload>({
    values: defaultValues,
  });

  async function onSubmit(data: HospedagemPayload) {
    if (isLoading) return;

    try {
      setIsLoading(true);
      await onSaved({
        clienteId: Number(data.clienteId),
        acomodacaoId: Number(data.acomodacaoId),
        dataEntrada: data.dataEntrada || undefined,
        dataSaida: data.dataSaida || null,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <FieldGroup className="grid grid-cols-1 gap-4 @sm:grid-cols-2">
        <Field>
          <FieldLabel>Hospede</FieldLabel>
          <Controller
            control={control}
            name="clienteId"
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={String(field.value || "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={String(cliente.id)}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field>
          <FieldLabel>Acomodacao</FieldLabel>
          <Controller
            control={control}
            name="acomodacaoId"
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={String(field.value || "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {acomodacoes.map((acomodacao) => (
                      <SelectItem key={acomodacao.id} value={String(acomodacao.id)}>
                        {labelAcomodacao(acomodacao.nome)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field>
          <FieldLabel>Entrada</FieldLabel>
          <Input type="date" {...register("dataEntrada")} />
        </Field>

        <Field>
          <FieldLabel>Saida</FieldLabel>
          <Input type="date" {...register("dataSaida")} />
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading || !clientes.length || !acomodacoes.length}>
          {isLoading ? "salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}

function hospedagemToForm(
  hospedagem: Hospedagem | null | undefined,
  clienteFallback: number,
  acomodacaoFallback: number,
): HospedagemPayload {
  if (!hospedagem) {
    return {
      clienteId: clienteFallback,
      acomodacaoId: acomodacaoFallback,
      dataEntrada: new Date().toISOString().slice(0, 10),
      dataSaida: "",
    };
  }

  return {
    clienteId: hospedagem.clienteId,
    acomodacaoId: hospedagem.acomodacaoId,
    dataEntrada: hospedagem.dataEntrada.slice(0, 10),
    dataSaida: hospedagem.dataSaida?.slice(0, 10) ?? "",
  };
}

function labelAcomodacao(nome: string) {
  return acomodacaoLabels[nome] ?? nome;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(value));
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground">{label}:</span>
      <span>{value}</span>
    </div>
  );
}

export default Hospedagens;
