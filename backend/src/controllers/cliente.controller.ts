import { prisma } from "../lib/prisma.js";
import type { Request, Response } from "express";

const clienteInclude = {
  dependentes: {
    include: {
      documentos: true,
      endereco: true,
      telefones: true,
    },
  },
  documentos: true,
  endereco: true,
  hospedagems: {
    include: {
      acomodacao: true,
    },
  },
  telefones: true,
  titular: true,
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

async function removeOrphans(tx: any) {
  await tx.telefone.deleteMany({
    where: {
      clientes: {
        none: {},
      },
    },
  });

  await tx.endereco.deleteMany({
    where: {
      clientes: {
        none: {},
      },
    },
  });
}

export async function getClientes(req: Request, res: Response) {
  try {
    const clientes = await prisma.cliente.findMany({
      include: clienteInclude,
      orderBy: {
        nome: "asc",
      },
    });
    return res.status(200).json(clientes);
  } catch (error) {
    return res.status(500).json(serializeError(error));
  }
}

export async function getClienteById(req: Request, res: Response) {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "Id de cliente inválido" });
    }

    const cliente = await prisma.cliente.findUniqueOrThrow({
      where: {
        id,
      },
      include: clienteInclude,
    });

    return res.status(200).json(cliente);
  } catch (error) {
    return res.status(404).json(serializeError(error));
  }
}

export async function getDependentesByTitular(req: Request, res: Response) {
  try {
    const titularId = parseId(req.params.id);

    if (!titularId) {
      return res.status(400).json({ message: "Id de titular inválido" });
    }

    const titular = await prisma.cliente.findUnique({
      where: {
        id: titularId,
      },
      include: {
        dependentes: {
          include: clienteInclude,
          orderBy: {
            nome: "asc",
          },
        },
      },
    });

    if (!titular) {
      return res.status(404).json({ message: "Titular não encontrado" });
    }

    return res.status(200).json(titular.dependentes);
  } catch (error) {
    return res.status(500).json(serializeError(error));
  }
}

export async function getTitularByDependente(req: Request, res: Response) {
  try {
    const dependenteId = parseId(req.params.id);

    if (!dependenteId) {
      return res.status(400).json({ message: "Id de dependente inválido" });
    }

    const dependente = await prisma.cliente.findUnique({
      where: {
        id: dependenteId,
      },
      include: {
        titular: {
          include: clienteInclude,
        },
      },
    });

    if (!dependente) {
      return res.status(404).json({ message: "Dependente não encontrado" });
    }

    if (!dependente.titular) {
      return res.status(404).json({ message: "Cliente informado não possui titular" });
    }

    return res.status(200).json(dependente.titular);
  } catch (error) {
    return res.status(500).json(serializeError(error));
  }
}

export async function postClienteTitular(req: Request, res: Response) {
  try {
    const { nome, nomeSocial, dataNascimento, endereco, telefones, documentos } = req.body;

    const cliente = await prisma.cliente.create({
      data: {
        nome,
        nomeSocial,
        dataNascimento: new Date(dataNascimento),
        dataCadastro: new Date(),

        endereco: {
          create: {
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            codigoPostal: endereco.codigoPostal,
            estado: endereco.estado,
            pais: endereco.pais,
            rua: endereco.rua,
          },
        },

        ...(telefones?.length && {
          telefones: {
            create: telefones.map((t: any) => ({
              ddd: t.ddd,
              numero: t.numero,
            })),
          },
        }),

        ...(documentos?.length && {
          documentos: {
            create: documentos.map((d: any) => ({
              numero: d.numero,
              tipo: d.tipo,
              dataExpedicao: new Date(d.dataExpedicao),
            })),
          },
        }),
      },
      include: clienteInclude,
    });

    return res.status(201).json(cliente);
  } catch (error) {
    return res.status(500).json(serializeError(error));
  }
}

export async function postClienteDependentes(req: Request, res: Response) {
  try {
    const titularId = parseId(req.params.id);

    if (!titularId) {
      return res.status(400).json({ message: "Id de titular inválido" });
    }

    const titular = await prisma.cliente.findUnique({
      where: {
        id: titularId,
      },
      include: {
        telefones: true,
      },
    });

    if (!titular) {
      return res.status(404).json({ message: "Titular não encontrado" });
    }

    const dependentesData = Array.isArray(req.body) ? req.body : [req.body];

    if (!dependentesData.length) {
      return res.status(400).json({ message: "Informe pelo menos um dependente" });
    }

    const dependentes = await prisma.$transaction(
      dependentesData.map((d: any) =>
        prisma.cliente.create({
          data: {
            nome: d.nome,
            nomeSocial: d.nomeSocial,
            dataNascimento: new Date(d.dataNascimento),
            dataCadastro: new Date(),

            titularId: titular.id,
            enderecoId: titular.enderecoId,

            telefones: {
              connect: titular.telefones.map((t) => ({
                id: t.id,
              })),
            },

            documentos: {
              create: d.documentos.map((doc: any) => ({
                numero: doc.numero,
                tipo: doc.tipo,
                dataExpedicao: new Date(doc.dataExpedicao),
              })),
            },
          },
          include: clienteInclude,
        }),
      ),
    );

    return res.status(201).json(dependentes);
  } catch (error) {
    return res.status(500).json(serializeError(error));
  }
}

export async function putCliente(req: Request, res: Response) {
  try {
    const clienteId = parseId(req.params.id);

    if (!clienteId) {
      return res.status(400).json({ message: "Id de cliente inválido" });
    }

    const { nome, nomeSocial, dataNascimento, endereco, telefones, documentos } = req.body;

    const cliente = await prisma.$transaction(async (tx) => {
      const clienteAtual = await tx.cliente.findUnique({
        where: {
          id: clienteId,
        },
        include: {
          dependentes: true,
        },
      });

      if (!clienteAtual) {
        throw new Error("Cliente não encontrado");
      }

      const data: any = {};

      if (nome !== undefined) {
        data.nome = nome;
      }

      if (nomeSocial !== undefined) {
        data.nomeSocial = nomeSocial;
      }

      if (dataNascimento !== undefined) {
        data.dataNascimento = new Date(dataNascimento);
      }

      if (Object.keys(data).length) {
        await tx.cliente.update({
          data,
          where: {
            id: clienteId,
          },
        });
      }

      if (Array.isArray(documentos)) {
        await tx.documento.deleteMany({
          where: {
            clienteId,
          },
        });

        await Promise.all(
          documentos.map((documento: any) =>
            tx.documento.create({
              data: {
                clienteId,
                numero: documento.numero,
                tipo: documento.tipo,
                dataExpedicao: new Date(documento.dataExpedicao),
              },
            }),
          ),
        );
      }

      if (!clienteAtual.titularId && endereco) {
        await tx.endereco.update({
          where: {
            id: clienteAtual.enderecoId,
          },
          data: {
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            codigoPostal: endereco.codigoPostal,
            estado: endereco.estado,
            pais: endereco.pais,
            rua: endereco.rua,
          },
        });
      }

      if (!clienteAtual.titularId && Array.isArray(telefones)) {
        const novosTelefones = await Promise.all(
          telefones.map((telefone: any) =>
            tx.telefone.create({
              data: {
                ddd: telefone.ddd,
                numero: telefone.numero,
              },
            }),
          ),
        );

        const familiaIds = [clienteAtual.id, ...clienteAtual.dependentes.map((dependente) => dependente.id)];

        await Promise.all(
          familiaIds.map((familiaId) =>
            tx.cliente.update({
              where: {
                id: familiaId,
              },
              data: {
                telefones: {
                  set: novosTelefones.map((telefone) => ({ id: telefone.id })),
                },
              },
            }),
          ),
        );

        await removeOrphans(tx);
      }

      return tx.cliente.findUniqueOrThrow({
        where: {
          id: clienteId,
        },
        include: clienteInclude,
      });
    });

    return res.status(200).json(cliente);
  } catch (error) {
    return res.status(500).json(serializeError(error));
  }
}

export async function deleteCliente(req: Request, res: Response) {
  try {
    const clienteId = parseId(req.params.id);

    if (!clienteId) {
      return res.status(400).json({ message: "Id de cliente inválido" });
    }

    const cliente = await prisma.$transaction(async (tx) => {
      const clienteAtual = await tx.cliente.findUnique({
        where: {
          id: clienteId,
        },
        include: {
          dependentes: true,
        },
      });

      if (!clienteAtual) {
        throw new Error("Cliente não encontrado");
      }

      const clienteIds = [clienteAtual.id, ...clienteAtual.dependentes.map((dependente) => dependente.id)];

      await tx.documento.deleteMany({
        where: {
          clienteId: {
            in: clienteIds,
          },
        },
      });

      await tx.hospedagem.deleteMany({
        where: {
          clienteId: {
            in: clienteIds,
          },
        },
      });

      await tx.cliente.deleteMany({
        where: {
          id: {
            in: clienteAtual.dependentes.map((dependente) => dependente.id),
          },
        },
      });

      const clienteRemovido = await tx.cliente.delete({
        where: {
          id: clienteAtual.id,
        },
      });

      await removeOrphans(tx);

      return clienteRemovido;
    });

    return res.status(200).json(cliente);
  } catch (error) {
    return res.status(500).json(serializeError(error));
  }
}
