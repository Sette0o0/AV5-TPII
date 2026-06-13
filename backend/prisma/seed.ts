import { AcomodacoesEnum, TiposDocumentoEnum } from "../src/generated/prisma/enums.js";

import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.documento.deleteMany();
  await prisma.telefone.deleteMany();
  await prisma.hospedagem.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.endereco.deleteMany();
  await prisma.acomodacao.deleteMany();

  await prisma.acomodacao.createMany({
    data: [
      {
        nome: AcomodacoesEnum.solteiro_simples,
        camaSolteiro: 1,
        camaCasal: 0,
        climatizacao: true,
        garagem: 0,
        suite: 1,
      },
      {
        nome: AcomodacoesEnum.solteiro_mais,
        camaSolteiro: 0,
        camaCasal: 1,
        suite: 1,
        climatizacao: true,
        garagem: 1,
      },
      {
        nome: AcomodacoesEnum.casal_simples,
        camaSolteiro: 0,
        camaCasal: 1,
        suite: 1,
        climatizacao: true,
        garagem: 1,
      },
      {
        nome: AcomodacoesEnum.familia_simples,
        camaSolteiro: 2,
        camaCasal: 1,
        suite: 1,
        climatizacao: true,
        garagem: 1,
      },
      {
        nome: AcomodacoesEnum.familia_mais,
        camaSolteiro: 5,
        camaCasal: 1,
        suite: 2,
        climatizacao: true,
        garagem: 2,
      },
      {
        nome: AcomodacoesEnum.familia_super,
        camaSolteiro: 6,
        camaCasal: 2,
        suite: 3,
        climatizacao: true,
        garagem: 2,
      },
    ],
  });

  const enderecoFamilia = await prisma.endereco.create({
    data: {
      rua: "Rua das Palmeiras, 123",
      bairro: "Centro",
      cidade: "São José dos Campos",
      estado: "SP",
      pais: "Brasil",
      codigoPostal: "12210-000",
    },
  });

  const telefone1 = await prisma.telefone.create({
    data: {
      ddd: "12",
      numero: "991111111",
    },
  });

  const telefone2 = await prisma.telefone.create({
    data: {
      ddd: "12",
      numero: "992222222",
    },
  });

  const titular1 = await prisma.cliente.create({
    data: {
      nome: "João da Silva",
      nomeSocial: "João",
      dataNascimento: new Date("1985-05-10"),
      dataCadastro: new Date(),

      enderecoId: enderecoFamilia.id,

      telefones: {
        connect: [{ id: telefone1.id }, { id: telefone2.id }],
      },

      documentos: {
        create: [
          {
            numero: "12345678901",
            tipo: TiposDocumentoEnum.cpf,
            dataExpedicao: new Date("2015-01-15"),
          },
          {
            numero: "12345678",
            tipo: TiposDocumentoEnum.rg,
            dataExpedicao: new Date("2010-03-20"),
          },
        ],
      },
    },
  });

  await prisma.cliente.create({
    data: {
      nome: "Maria da Silva",
      nomeSocial: "Maria",
      dataNascimento: new Date("2012-09-18"),
      dataCadastro: new Date(),

      enderecoId: enderecoFamilia.id,
      titularId: titular1.id,

      telefones: {
        connect: [{ id: telefone1.id }, { id: telefone2.id }],
      },

      documentos: {
        create: [
          {
            numero: "98765432100",
            tipo: TiposDocumentoEnum.cpf,
            dataExpedicao: new Date("2022-04-01"),
          },
        ],
      },
    },
  });

  const enderecoTitular2 = await prisma.endereco.create({
    data: {
      rua: "Av. Independência, 456",
      bairro: "Jardim América",
      cidade: "Taubaté",
      estado: "SP",
      pais: "Brasil",
      codigoPostal: "12030-100",
    },
  });

  await prisma.cliente.create({
    data: {
      nome: "Ana Oliveira",
      nomeSocial: "Ana",
      dataNascimento: new Date("1990-11-22"),
      dataCadastro: new Date(),

      enderecoId: enderecoTitular2.id,

      telefones: {
        create: [
          {
            ddd: "12",
            numero: "993333333",
          },
        ],
      },

      documentos: {
        create: [
          {
            numero: "45678912300",
            tipo: TiposDocumentoEnum.cpf,
            dataExpedicao: new Date("2016-08-12"),
          },
          {
            numero: "91234567",
            tipo: TiposDocumentoEnum.passaporte,
            dataExpedicao: new Date("2023-05-10"),
          },
        ],
      },
    },
  });

  console.log("Seed executado com sucesso!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
