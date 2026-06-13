import type { AcomodacoesEnum, TiposDocumentoEnum } from "./enums";

export type Acomodacao = {
  id: number;
  nome: AcomodacoesEnum;
  camaSolteiro: number;
  camaCasal: number;
  suite: number;
  climatizacao: boolean;
  garagem: number;
};

export type Documento = {
  numero: string;
  tipo: TiposDocumentoEnum;
  dataExpedicao: string;
};

export type Endereco = {
  id: number;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  codigoPostal: string;
};

export type Hospedagem = {
  id: number;
  dataEntrada: string;
  dataSaida: string | null;
  clienteId: number;
  acomodacaoId: number;
};

export type Telefone = {
  id: number;
  ddd: string;
  numero: string;
};

export type Cliente = {
  id: number;
  nome: string;
  nomeSocial: string;
  dataNascimento: string;
  dataCadastro: string;
  enderecoId: number;
  titularId: number | null;
};
