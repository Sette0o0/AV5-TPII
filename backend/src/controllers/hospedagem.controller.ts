import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

const hospedagemInclude = {
  acomodacao: true,
  cliente: {
    include: {
      dependentes: true,
      documentos: true,
      endereco: true,
      telefones: true,
      titular: true,
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

function parseOptionalDate(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return new Date(String(value));
}

function normalizeClienteIds(clienteId: unknown, clienteIds: unknown) {
  if (Array.isArray(clienteIds)) {
    return clienteIds.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0);
  }

  const parsed = Number(clienteId);
  return Number.isInteger(parsed) && parsed > 0 ? [parsed] : [];
}

export async function getHospedagens(req: Request, res: Response) {
  try {
    const { ativas, clienteId, acomodacaoId } = req.query;
    const where: any = {};

    if (ativas === "true") {
      where.dataSaida = null;
    }

    if (clienteId !== undefined) {
      where.clienteId = Number(clienteId);
    }

    if (acomodacaoId !== undefined) {
      where.acomodacaoId = Number(acomodacaoId);
    }

    const hospedagens = await prisma.hospedagem.findMany({
      where,
      include: hospedagemInclude,
      orderBy: {
        dataEntrada: "desc",
      },
    });

    return res.status(200).json(hospedagens);
  } catch (error) {
    return res.status(500).json(serializeError(error));
  }
}

export async function getHospedagemById(req: Request, res: Response) {
  try {
    const hospedagemId = parseId(req.params.id);

    if (!hospedagemId) {
      return res.status(400).json({ message: "Id de hospedagem invalido" });
    }

    const hospedagem = await prisma.hospedagem.findUnique({
      where: {
        id: hospedagemId,
      },
      include: hospedagemInclude,
    });

    if (!hospedagem) {
      return res.status(404).json({ message: "Hospedagem nao encontrada" });
    }

    return res.status(200).json(hospedagem);
  } catch (error) {
    return res.status(500).json(serializeError(error));
  }
}

export async function postHospedagem(req: Request, res: Response) {
  try {
    const { clienteId, clienteIds, acomodacaoId, dataEntrada, dataSaida } = req.body;
    const hospedesIds = normalizeClienteIds(clienteId, clienteIds);
    const acomodacao = parseId(String(acomodacaoId));

    if (!hospedesIds.length) {
      return res.status(400).json({ message: "Informe pelo menos um cliente para hospedar" });
    }

    if (!acomodacao) {
      return res.status(400).json({ message: "Id de acomodacao invalido" });
    }

    const [clientesEncontrados, acomodacaoEncontrada, hospedagensAtivas] = await Promise.all([
      prisma.cliente.count({
        where: {
          id: {
            in: hospedesIds,
          },
        },
      }),
      prisma.acomodacao.findUnique({
        where: {
          id: acomodacao,
        },
      }),
      prisma.hospedagem.findMany({
        where: {
          clienteId: {
            in: hospedesIds,
          },
          dataSaida: null,
        },
      }),
    ]);

    if (clientesEncontrados !== hospedesIds.length) {
      return res.status(404).json({ message: "Um ou mais clientes nao foram encontrados" });
    }

    if (!acomodacaoEncontrada) {
      return res.status(404).json({ message: "Acomodacao nao encontrada" });
    }

    if (hospedagensAtivas.length) {
      return res.status(409).json({ message: "Um ou mais clientes ja possuem hospedagem ativa" });
    }

    const entrada = parseOptionalDate(dataEntrada) ?? new Date();
    const saida = parseOptionalDate(dataSaida);

    const hospedagens = await prisma.$transaction(
      hospedesIds.map((hospedeId) =>
        prisma.hospedagem.create({
          data: {
            clienteId: hospedeId,
            acomodacaoId: acomodacao,
            dataEntrada: entrada,
            ...(saida && { dataSaida: saida }),
          },
          include: hospedagemInclude,
        }),
      ),
    );

    return res.status(201).json(hospedagens);
  } catch (error) {
    return res.status(500).json(serializeError(error));
  }
}

export async function putHospedagem(req: Request, res: Response) {
  try {
    const hospedagemId = parseId(req.params.id);

    if (!hospedagemId) {
      return res.status(400).json({ message: "Id de hospedagem invalido" });
    }

    const { clienteId, acomodacaoId, dataEntrada, dataSaida } = req.body;
    const data: any = {};
    const novoClienteId = clienteId !== undefined ? parseId(String(clienteId)) : undefined;
    const novaAcomodacaoId = acomodacaoId !== undefined ? parseId(String(acomodacaoId)) : undefined;

    if (clienteId !== undefined && !novoClienteId) {
      return res.status(400).json({ message: "Id de cliente invalido" });
    }

    if (acomodacaoId !== undefined && !novaAcomodacaoId) {
      return res.status(400).json({ message: "Id de acomodacao invalido" });
    }

    if (typeof novoClienteId === "number") {
      const hospedagemAtiva = await prisma.hospedagem.findFirst({
        where: {
          clienteId: novoClienteId,
          dataSaida: null,
          NOT: {
            id: hospedagemId,
          },
        },
      });

      if (hospedagemAtiva) {
        return res.status(409).json({ message: "Cliente ja possui hospedagem ativa" });
      }

      data.clienteId = novoClienteId;
    }

    if (typeof novaAcomodacaoId === "number") {
      data.acomodacaoId = novaAcomodacaoId;
    }

    if (dataEntrada !== undefined) {
      data.dataEntrada = parseOptionalDate(dataEntrada);
    }

    if (dataSaida !== undefined) {
      data.dataSaida = parseOptionalDate(dataSaida) ?? null;
    }

    const hospedagem = await prisma.hospedagem.update({
      where: {
        id: hospedagemId,
      },
      data,
      include: hospedagemInclude,
    });

    return res.status(200).json(hospedagem);
  } catch (error) {
    return res.status(500).json(serializeError(error));
  }
}

export async function encerrarHospedagem(req: Request, res: Response) {
  try {
    const hospedagemId = parseId(req.params.id);

    if (!hospedagemId) {
      return res.status(400).json({ message: "Id de hospedagem invalido" });
    }

    const dataSaida = parseOptionalDate(req.body.dataSaida) ?? new Date();

    const hospedagem = await prisma.hospedagem.update({
      where: {
        id: hospedagemId,
      },
      data: {
        dataSaida,
      },
      include: hospedagemInclude,
    });

    return res.status(200).json(hospedagem);
  } catch (error) {
    return res.status(500).json(serializeError(error));
  }
}

export async function deleteHospedagem(req: Request, res: Response) {
  try {
    const hospedagemId = parseId(req.params.id);

    if (!hospedagemId) {
      return res.status(400).json({ message: "Id de hospedagem invalido" });
    }

    const hospedagem = await prisma.hospedagem.delete({
      where: {
        id: hospedagemId,
      },
    });

    return res.status(200).json(hospedagem);
  } catch (error) {
    return res.status(500).json(serializeError(error));
  }
}
