import type { AcomodacoesEnum, TiposDocumentoEnum } from "./enums";

export type EnderecoPost = {
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  codigoPostal: string;
};

export type TelefonePost = {
  ddd: string;
  numero: string;
};

export type DocumentoPost = {
  numero: string;
  tipo: TiposDocumentoEnum;
  dataExpedicao: string;
};

export type PostClienteTitularReq = {
  nome: string;
  nomeSocial: string;
  dataNascimento: string;
  endereco: EnderecoPost;
  telefones: TelefonePost[];
  documentos: DocumentoPost[];
};

export type PostClienteDependentesReq = {
  nome: string;
  nomeSocial: string;
  dataNascimento: string;
  documentos: DocumentoPost[];
}[];

export type ClientePayload = PostClienteTitularReq;

export type DependentePayload = {
  nome: string;
  nomeSocial: string;
  dataNascimento: string;
  documentos: DocumentoPost[];
};

export type AcomodacaoPayload = {
  nome: AcomodacoesEnum;
  camaSolteiro: number;
  camaCasal: number;
  suite: number;
  climatizacao: boolean;
  garagem: number;
};

export type HospedagemPayload = {
  clienteId: number;
  acomodacaoId: number;
  dataEntrada?: string;
  dataSaida?: string | null;
};
