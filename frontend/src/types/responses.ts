import type { Cliente, Documento, Endereco, Hospedagem, Telefone } from "./entidades";

export type GetClientesRes = Cliente &
  {telefones: Telefone[]} &
  {dependentes: Cliente[]} &
  {documentos: Documento[]} &
  {endereco: Endereco} &
  {titular: Cliente | null}

export type GetClienteByIdRes = Cliente &
  {telefones: Telefone[]} &
  {dependentes: Cliente[]} &
  {documentos: Documento[]} &
  {endereco: Endereco} &
  {hospedagens: Hospedagem[]} &
  {titular: Cliente | null}