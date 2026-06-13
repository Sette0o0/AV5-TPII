import type { Acomodacao } from "@/types/entidades";
import type { AcomodacaoPayload } from "@/types/requests";
import api from "./api";

export async function listarAcomodacoes() {
  const response = await api.get<Acomodacao[]>("/acomodacoes");

  return response.data;
}

export async function cadastrarAcomodacao(payload: AcomodacaoPayload) {
  const response = await api.post<Acomodacao>("/acomodacoes", payload);

  return response.data;
}

export async function editarAcomodacao(id: string | number, payload: Partial<AcomodacaoPayload>) {
  const response = await api.put<Acomodacao>(`/acomodacoes/${id}`, payload);

  return response.data;
}

export async function excluirAcomodacao(id: string | number) {
  const response = await api.delete<Acomodacao>(`/acomodacoes/${id}`);

  return response.data;
}
