import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

const acomodacaoInclude = {
  hospedagems: {
    include: {
      cliente: true,
    },
  },
};

function parseId(id: unknown) {
  const parsed = Number(id);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function serializeError(error: unknown) {
  return {
    message: error instanceof Error ? error.message : "Erro interno no servidor",
  };
}

function toBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  return value === "true" || value === "1";
}

export async function getAcomodacoes(req: Request, res: Response) {
  try {
    const acomodacoes = await prisma.acomodacao.findMany({
      include: acomodacaoInclude,
      orderBy: {
        nome: "asc",
      },
    });

    return res.status(200).json(acomodacoes);
  } catch (error) {
    return res.status(500).json(serializeError(error));
  }
}

export async function getAcomodacaoById(req: Request, res: Response) {
  try {
    const acomodacaoId = parseId(req.params.id);

    if (!acomodacaoId) {
      return res.status(400).json({ message: "Id de acomodacao invalido" });
    }

    const acomodacao = await prisma.acomodacao.findUnique({
      include: acomodacaoInclude,
      where: {
        id: acomodacaoId,
      },
    });

    if (!acomodacao) {
      return res.status(404).json({ message: "Acomodacao nao encontrada" });
    }

    return res.status(200).json(acomodacao);
  } catch (error) {
    return res.status(500).json(serializeError(error));
  }
}

export async function postAcomodacao(req: Request, res: Response) {
  try {
    const { nome, camaSolteiro, camaCasal, suite, climatizacao, garagem } = req.body;

    const acomodacao = await prisma.acomodacao.create({
      data: {
        nome,
        camaSolteiro: Number(camaSolteiro),
        camaCasal: Number(camaCasal),
        suite: Number(suite),
        climatizacao: toBoolean(climatizacao),
        garagem: Number(garagem),
      },
      include: acomodacaoInclude,
    });

    return res.status(201).json(acomodacao);
  } catch (error) {
    return res.status(500).json(serializeError(error));
  }
}

export async function putAcomodacao(req: Request, res: Response) {
  try {
    const acomodacaoId = parseId(req.params.id);

    if (!acomodacaoId) {
      return res.status(400).json({ message: "Id de acomodacao invalido" });
    }

    const { nome, camaSolteiro, camaCasal, suite, climatizacao, garagem } = req.body;
    const data: any = {};

    if (nome !== undefined) {
      data.nome = nome;
    }

    if (camaSolteiro !== undefined) {
      data.camaSolteiro = Number(camaSolteiro);
    }

    if (camaCasal !== undefined) {
      data.camaCasal = Number(camaCasal);
    }

    if (suite !== undefined) {
      data.suite = Number(suite);
    }

    if (climatizacao !== undefined) {
      data.climatizacao = toBoolean(climatizacao);
    }

    if (garagem !== undefined) {
      data.garagem = Number(garagem);
    }

    const acomodacao = await prisma.acomodacao.update({
      where: {
        id: acomodacaoId,
      },
      data,
      include: acomodacaoInclude,
    });

    return res.status(200).json(acomodacao);
  } catch (error) {
    return res.status(500).json(serializeError(error));
  }
}

export async function deleteAcomodacao(req: Request, res: Response) {
  try {
    const acomodacaoId = parseId(req.params.id);

    if (!acomodacaoId) {
      return res.status(400).json({ message: "Id de acomodacao invalido" });
    }

    const acomodacao = await prisma.$transaction(async (tx) => {
      await tx.hospedagem.deleteMany({
        where: {
          acomodacaoId,
        },
      });

      return tx.acomodacao.delete({
        where: {
          id: acomodacaoId,
        },
      });
    });

    return res.status(200).json(acomodacao);
  } catch (error) {
    return res.status(500).json(serializeError(error));
  }
}
