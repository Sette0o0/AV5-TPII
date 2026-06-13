-- CreateTable
CREATE TABLE "Acomodacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "camaSolteiro" INTEGER NOT NULL,
    "camaCasal" INTEGER NOT NULL,
    "suite" INTEGER NOT NULL,
    "climatizacao" BOOLEAN NOT NULL,
    "garagem" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Telefone" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ddd" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "clienteId" INTEGER,
    CONSTRAINT "Telefone_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Endereco" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rua" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "codigoPostal" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Documento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "dataExpedicao" DATETIME NOT NULL,
    "clienteId" INTEGER,
    CONSTRAINT "Documento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeSocial" TEXT NOT NULL,
    "dataNascimento" DATETIME NOT NULL,
    "dataCadastro" DATETIME NOT NULL,
    "enderecoId" INTEGER NOT NULL,
    "titularId" INTEGER,
    CONSTRAINT "Cliente_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "Endereco" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Cliente_titularId_fkey" FOREIGN KEY ("titularId") REFERENCES "Cliente" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Hospedagem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dataEntrada" DATETIME NOT NULL,
    "dataSaida" DATETIME,
    "clienteId" INTEGER NOT NULL,
    "acomodacaoId" INTEGER NOT NULL,
    CONSTRAINT "Hospedagem_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Hospedagem_acomodacaoId_fkey" FOREIGN KEY ("acomodacaoId") REFERENCES "Acomodacao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Acomodacao_nome_key" ON "Acomodacao"("nome");
