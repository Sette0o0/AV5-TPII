import type { NomeAcomadacao, TipoDocumento } from "./enums";

export type Acomodacao = {
  nomeAcomadacao: NomeAcomadacao;
  camaSolteiro: Number;
  camaCasal: Number;
  suite: Number;
  climatizacao: Boolean;
  garagem: Number;
};

export type Documento = {
  numero: string;
  tipo: TipoDocumento;
  dataExpedicao: Date | string;
};

export type Endereco = {
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  codigoPostal: string;
};

export type Hospedagem = {
  cliente: Cliente;
  acomodacao: Acomodacao;
  dataEntrada: Date | string;
};

export type Telefone = {
  ddd: string;
  numero: string;
};

export type Cliente = {
  nome: string;
  nomeSocial: string;
  dataNascimento: Date | string;
  dataCadastro: Date | string;
  telefones: Telefone[];
  endereco: Endereco;
  documentos: Documento[];
  dependentes: Cliente[];
  titular: Cliente | null;
};
