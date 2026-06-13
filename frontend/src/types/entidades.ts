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
  id?: number;
  numero: string;
  tipo: TiposDocumentoEnum;
  dataExpedicao: string;
  clienteId?: number;
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
  cliente?: ClienteCompleto;
  acomodacao?: Acomodacao;
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

export type ClienteCompleto = Cliente & {
  telefones: Telefone[];
  dependentes: ClienteCompleto[];
  documentos: Documento[];
  endereco: Endereco;
  hospedagems: Hospedagem[];
  titular: Cliente | null;
};
