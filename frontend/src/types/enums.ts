export const NomeAcomadacao = {
  SolteiroSimples: 'Acomodação simples para solteiro(a)',
  CasalSimples: 'Acomodação simples para casal',
  FamiliaSimples: 'Acomodação para família com até duas crianças',
  FamiliaMais: 'Acomodação para família com até cinco crianças',
  SolteiroMais: 'Acomodação com garagem para solteiro(a)',
  FamiliaSuper: 'Acomodação para até duas familias, casal e três crianças cada',
} as const

export type NomeAcomadacao = typeof NomeAcomadacao[keyof typeof NomeAcomadacao]

export const TipoDocumento = {
  CPF: 'Cadastro de Pessoas Física',
  RG: 'Registro Geral',
  Passaporte: 'Passaporte',
} as const

export type TipoDocumento = typeof TipoDocumento[keyof typeof TipoDocumento]