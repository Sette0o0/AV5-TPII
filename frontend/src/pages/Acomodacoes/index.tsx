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
import {
  cadastrarAcomodacao,
  editarAcomodacao,
  excluirAcomodacao,
  listarAcomodacoes,
} from "@/services/Acomodacoes";
import type { Acomodacao } from "@/types/entidades";
import { AcomodacoesEnum } from "@/types/enums";
import type { AcomodacaoPayload } from "@/types/requests";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const acomodacaoLabels: Record<string, string> = {
  solteiro_simples: "Solteiro Simples",
  solteiro_mais: "Solteiro Mais",
  casal_simples: "Casal Simples",
  familia_simples: "Familia Simples",
  familia_mais: "Familia Mais",
  familia_super: "Familia Super",
};

const emptyAcomodacao: AcomodacaoPayload = {
  nome: AcomodacoesEnum.solteiro_simples,
  camaSolteiro: 1,
  camaCasal: 0,
  suite: 1,
  climatizacao: true,
  garagem: 0,
};

function Acomodacoes() {
  const [acomodacoes, setAcomodacoes] = useState<Acomodacao[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [acomodacaoEditando, setAcomodacaoEditando] = useState<Acomodacao | null>(null);
  const [loading, setLoading] = useState(true);

  async function carregarAcomodacoes() {
    try {
      setLoading(true);
      setAcomodacoes(await listarAcomodacoes());
    } finally {
      setLoading(false);
    }
  }

  async function salvarAcomodacao(payload: AcomodacaoPayload) {
    if (acomodacaoEditando) {
      await editarAcomodacao(acomodacaoEditando.id, payload);
    } else {
      await cadastrarAcomodacao(payload);
    }

    await carregarAcomodacoes();
  }

  async function removerAcomodacao(acomodacao: Acomodacao) {
    const confirmado = window.confirm(`Excluir ${labelAcomodacao(acomodacao.nome)}?`);

    if (!confirmado) return;

    await excluirAcomodacao(acomodacao.id);
    await carregarAcomodacoes();
  }

  function fecharForm() {
    setOpenForm(false);
    setAcomodacaoEditando(null);
  }

  useEffect(() => {
    carregarAcomodacoes();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Acomodacoes</h1>
            <p className="text-sm text-muted-foreground">Tipos de quartos disponiveis para hospedagem.</p>
          </div>
          <Button onClick={() => setOpenForm(true)}>
            <Plus />
            Acomodacao
          </Button>
        </div>

        {loading ? (
          <div className="rounded-md border p-6 text-center text-muted-foreground">Carregando...</div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
            {acomodacoes.map((acomodacao) => (
              <Card key={acomodacao.id}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <CardTitle>{labelAcomodacao(acomodacao.nome)}</CardTitle>
                      <CardDescription>
                        {acomodacao.climatizacao ? "Com climatizacao" : "Sem climatizacao"}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        title="Editar"
                        onClick={() => {
                          setAcomodacaoEditando(acomodacao);
                          setOpenForm(true);
                        }}
                      >
                        <Edit />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="destructive"
                        title="Excluir"
                        onClick={() => removerAcomodacao(acomodacao)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2 text-sm">
                  <Metric label="Solteiro" value={acomodacao.camaSolteiro} />
                  <Metric label="Casal" value={acomodacao.camaCasal} />
                  <Metric label="Suites" value={acomodacao.suite} />
                  <Metric label="Garagem" value={acomodacao.garagem} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={openForm}
        setOpen={(open) => {
          if (!open) fecharForm();
          setOpenForm(open);
        }}
        title={acomodacaoEditando ? "Editar acomodacao" : "Cadastrar acomodacao"}
        className="min-w-lg"
      >
        <AcomodacaoForm
          acomodacao={acomodacaoEditando}
          onCancel={fecharForm}
          onSaved={async (payload) => {
            await salvarAcomodacao(payload);
            fecharForm();
          }}
        />
      </Modal>
    </>
  );
}

function labelAcomodacao(nome: string) {
  return acomodacaoLabels[nome] ?? nome;
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-muted px-3 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function acomodacaoToForm(acomodacao?: Acomodacao | null): AcomodacaoPayload {
  if (!acomodacao) return emptyAcomodacao;

  return {
    nome: acomodacao.nome,
    camaSolteiro: acomodacao.camaSolteiro,
    camaCasal: acomodacao.camaCasal,
    suite: acomodacao.suite,
    climatizacao: acomodacao.climatizacao,
    garagem: acomodacao.garagem,
  };
}

function AcomodacaoForm({
  acomodacao,
  onCancel,
  onSaved,
}: {
  acomodacao?: Acomodacao | null;
  onCancel: () => void;
  onSaved: (payload: AcomodacaoPayload) => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, control, handleSubmit } = useForm<AcomodacaoPayload>({
    values: acomodacaoToForm(acomodacao),
  });

  async function onSubmit(data: AcomodacaoPayload) {
    if (isLoading) return;

    try {
      setIsLoading(true);
      await onSaved({
        ...data,
        camaSolteiro: Number(data.camaSolteiro),
        camaCasal: Number(data.camaCasal),
        suite: Number(data.suite),
        garagem: Number(data.garagem),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Field>
        <FieldLabel>Tipo</FieldLabel>
        <Controller
          control={control}
          name="nome"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(AcomodacoesEnum).map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {labelAcomodacao(tipo)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      <FieldGroup className="grid grid-cols-1 gap-4 @sm:grid-cols-2">
        <Field>
          <FieldLabel>Camas de solteiro</FieldLabel>
          <Input type="number" min={0} {...register("camaSolteiro", { valueAsNumber: true })} />
        </Field>
        <Field>
          <FieldLabel>Camas de casal</FieldLabel>
          <Input type="number" min={0} {...register("camaCasal", { valueAsNumber: true })} />
        </Field>
        <Field>
          <FieldLabel>Suites</FieldLabel>
          <Input type="number" min={0} {...register("suite", { valueAsNumber: true })} />
        </Field>
        <Field>
          <FieldLabel>Garagem</FieldLabel>
          <Input type="number" min={0} {...register("garagem", { valueAsNumber: true })} />
        </Field>
        <Field>
          <FieldLabel>Climatizacao</FieldLabel>
          <Controller
            control={control}
            name="climatizacao"
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(value === "true")}
                value={String(field.value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Nao</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}

export default Acomodacoes;
