export const NomeAcomadacao = {
  SolteiroSimples: "Acomodação simples para solteiro(a)",
  CasalSimples: "Acomodação simples para casal",
  FamiliaSimples: "Acomodação para família com até duas crianças",
  FamiliaMais: "Acomodação para família com até cinco crianças",
  SolteiroMais: "Acomodação com garagem para solteiro(a)",
  FamiliaSuper: "Acomodação para até duas familias, casal e três crianças cada",
} as const;

export type NomeAcomadacao = (typeof NomeAcomadacao)[keyof typeof NomeAcomadacao];

export const AcomodacoesEnum = {
  solteiro_simples: "solteiro_simples",
  casal_simples: "casal_simples",
  familia_simples: "familia_simples",
  familia_mais: "familia_mais",
  solteiro_mais: "solteiro_mais",
  familia_super: "familia_super",
} as const;

export type AcomodacoesEnum = (typeof AcomodacoesEnum)[keyof typeof AcomodacoesEnum]

export const TipoDocumento = {
  CPF: "Cadastro de Pessoas Física",
  RG: "Registro Geral",
  Passaporte: "Passaporte",
} as const;

export type TipoDocumento = (typeof TipoDocumento)[keyof typeof TipoDocumento];

export const TiposDocumentoEnum = {
  cpf: "cpf",
  rg: "rg",
  passaporte: "passaporte",
} as const

export type TiposDocumentoEnum = (typeof TiposDocumentoEnum)[keyof typeof TiposDocumentoEnum]