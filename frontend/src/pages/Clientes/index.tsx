import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { normalizarString } from "@/lib/utils";
import { listarClientes } from "@/services/Clientes";
import type { Cliente } from "@/types/entidades";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CadastroCliente from "./CadastroCliente";

function Cliente() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const [search, setSearch] = useState("");

  const [openCadastro, setOpenCadastro] = useState(false);

  async function carregarClientes() {
    try {
      setClientes(await listarClientes());
    } catch (error) {
      console.error("Erro ao carregar clientes.");
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  return (
    <>
      {/* Page */}
      <div className="">
        {/* Lista de clientes */}
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex justify-end w-full">
            <Button className="mr-auto" onClick={() => setOpenCadastro(true)}>
              <Plus />
              Cliente
            </Button>

            {/* search */}
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisa..."
              className="max-w-lg w-full"
            />

            {/* filtro */}
          </div>

          {/* Body */}
          <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
            <ListaClientes clientes={clientes} search={search} />
          </div>
        </div>
      </div>
      <Modal open={openCadastro} setOpen={setOpenCadastro} title="Cadastro de Cliente" className="min-w-lg">
        <CadastroCliente onClose={() => setOpenCadastro(false)} />
      </Modal>
    </>
  );
}

export default Cliente;

type ListaClientesProps = {
  clientes?: Cliente[];
  search?: string;
};

function ListaClientes({ clientes = [], search = "" }: ListaClientesProps) {
  const clientesFiltrados = useMemo(() => {
    return clientes.filter((cliente) => {
      return normalizarString(cliente.nome).includes(normalizarString(search));
    });
  }, [clientes, search]);

  return (
    <>
      {clientesFiltrados.length > 0 ? (
        clientesFiltrados.map((cliente) => (
          <Card
            key={cliente.nome + cliente.endereco}
            className="gap-4 cursor-pointer hover:scale-102 active:scale-98 transition hover:bg-accent"
            onClick={() => alert()}
          >
            <CardHeader>
              <CardTitle>{cliente.nome}</CardTitle>
              <CardDescription>{cliente.nomeSocial}</CardDescription>
            </CardHeader>
            <CardContent className="text-xs">
              <div className="flex flex-col">
                <div className="flex flex-row gap-2">
                  <div className="text-muted-foreground">Endereço:</div>
                  <div>
                    {cliente.endereco.estado} - {cliente.endereco.cidade}
                  </div>
                </div>
                {cliente.dependentes.length > 0 && (
                  <div className="flex flex-row gap-2">
                    <div className="text-muted-foreground">Dependentes:</div>
                    <div>{cliente.dependentes.map((dependente) => dependente.nome).join(", ")}</div>
                  </div>
                )}
                {cliente.titular && (
                  <div className="flex flex-row gap-2">
                    <div className="text-muted-foreground">Titular:</div>
                    <div>{cliente.titular.nome}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="w-full text-center">Nenhum cliente encontrado</div>
      )}
    </>
  );
}
