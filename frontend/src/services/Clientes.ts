import type { GetClienteByIdRes, GetClientesRes } from "@/types/responses";
import api from "./api";
import type { ClientePayload, DependentePayload, PostClienteTitularReq } from "@/types/requests";

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
    const response = await api.post<GetClienteByIdRes>("/clientes", payload)

    return response.data
  } catch (error) {
    console.log(error)
  }
}

export async function cadastrarDependente(titularId: string | number, payload: DependentePayload) {
  const response = await api.post<GetClienteByIdRes[]>(`/clientes/${titularId}/dependentes`, payload);

  return response.data;
}

export async function editarCliente(clienteId: string | number, payload: Partial<ClientePayload>) {
  const response = await api.put<GetClienteByIdRes>(`/clientes/${clienteId}`, payload);

  return response.data;
}

export async function excluirCliente(clienteId: string | number) {
  const response = await api.delete(`/clientes/${clienteId}`);

  return response.data;
}

export async function listarDependentes(titularId: string | number) {
  const response = await api.get<GetClientesRes[]>(`/clientes/${titularId}/dependentes`);

  return response.data;
}

export async function buscarTitular(dependenteId: string | number) {
  const response = await api.get<GetClienteByIdRes>(`/clientes/${dependenteId}/titular`);

  return response.data;
}
