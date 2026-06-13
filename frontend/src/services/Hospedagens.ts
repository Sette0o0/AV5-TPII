import type { Hospedagem } from "@/types/entidades";
import type { HospedagemPayload } from "@/types/requests";
import api from "./api";

export async function listarHospedagens(apenasAtivas = false) {
  const response = await api.get<Hospedagem[]>("/hospedagens", {
    params: apenasAtivas ? { ativas: true } : undefined,
  });

  return response.data;
}

export async function cadastrarHospedagem(payload: HospedagemPayload) {
  const response = await api.post<Hospedagem[]>("/hospedagens", payload);

  return response.data;
}

export async function editarHospedagem(id: string | number, payload: Partial<HospedagemPayload>) {
  const response = await api.put<Hospedagem>(`/hospedagens/${id}`, payload);

  return response.data;
}

export async function encerrarHospedagem(id: string | number, dataSaida?: string) {
  const response = await api.patch<Hospedagem>(`/hospedagens/${id}/checkout`, { dataSaida });

  return response.data;
}

export async function excluirHospedagem(id: string | number) {
  const response = await api.delete<Hospedagem>(`/hospedagens/${id}`);

  return response.data;
}
