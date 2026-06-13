import type { GetClienteByIdRes, GetClientesRes } from "@/types/responses";
import api from "./api";
import type { PostClienteTitularReq } from "@/types/requests";

export async function listarClientes() {
  try {
    const clientes = await api.get<GetClientesRes[]>("/clientes")

    return clientes.data
  } catch (error) {
    console.error(error)
  }
}

export async function buscarCliente(clienteId: string | number) {
  try {
    const cliente = await api.get<GetClienteByIdRes>(`/clientes/${clienteId}`)

    return cliente.data
  } catch (error) {
    console.error(error)
  }
}

export async function cadastrarTitular(payload: PostClienteTitularReq) {
  try {
    await api.post("/clientes", payload)
  } catch (error) {
    console.log(error)
  }
}