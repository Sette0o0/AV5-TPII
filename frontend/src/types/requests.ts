import type { TiposDocumentoEnum } from "./enums";

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
