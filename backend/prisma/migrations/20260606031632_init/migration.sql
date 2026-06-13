/*
  Warnings:

  - You are about to drop the column `clienteId` on the `Telefone` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_ClienteToTelefone" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ClienteToTelefone_A_fkey" FOREIGN KEY ("A") REFERENCES "Cliente" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ClienteToTelefone_B_fkey" FOREIGN KEY ("B") REFERENCES "Telefone" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Telefone" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ddd" TEXT NOT NULL,
    "numero" TEXT NOT NULL
);
INSERT INTO "new_Telefone" ("ddd", "id", "numero") SELECT "ddd", "id", "numero" FROM "Telefone";
DROP TABLE "Telefone";
ALTER TABLE "new_Telefone" RENAME TO "Telefone";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_ClienteToTelefone_AB_unique" ON "_ClienteToTelefone"("A", "B");

-- CreateIndex
CREATE INDEX "_ClienteToTelefone_B_index" ON "_ClienteToTelefone"("B");
