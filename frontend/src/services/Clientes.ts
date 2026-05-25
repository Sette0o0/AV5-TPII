import data from "@/mockdata.json";
import type { Cliente } from "@/types/entidades";

const clientes = data.clientes as unknown as Cliente[]

export async function listarClientes(): Promise<Cliente[]> {
  return clientes
}
