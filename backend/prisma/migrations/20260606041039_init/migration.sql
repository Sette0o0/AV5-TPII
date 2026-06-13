/*
  Warnings:

  - Added the required column `nome` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "nomeSocial" TEXT NOT NULL,
    "dataNascimento" DATETIME NOT NULL,
    "dataCadastro" DATETIME NOT NULL,
    "enderecoId" INTEGER NOT NULL,
    "titularId" INTEGER,
    CONSTRAINT "Cliente_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "Endereco" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Cliente_titularId_fkey" FOREIGN KEY ("titularId") REFERENCES "Cliente" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Cliente" ("dataCadastro", "dataNascimento", "enderecoId", "id", "nomeSocial", "titularId") SELECT "dataCadastro", "dataNascimento", "enderecoId", "id", "nomeSocial", "titularId" FROM "Cliente";
DROP TABLE "Cliente";
ALTER TABLE "new_Cliente" RENAME TO "Cliente";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
