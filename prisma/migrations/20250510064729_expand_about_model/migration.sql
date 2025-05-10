/*
  Warnings:

  - You are about to drop the column `values` on the `About` table. All the data in the column will be lost.
  - You are about to drop the column `vision` on the `About` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `InfoCard` table. All the data in the column will be lost.
  - Added the required column `valuesItems` to the `About` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valuesTitle` to the `About` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visionContent` to the `About` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visionTitle` to the `About` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_About" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "visionTitle" TEXT NOT NULL,
    "visionContent" TEXT NOT NULL,
    "valuesTitle" TEXT NOT NULL,
    "valuesItems" TEXT NOT NULL
);
INSERT INTO "new_About" ("id", "title") SELECT "id", "title" FROM "About";
DROP TABLE "About";
ALTER TABLE "new_About" RENAME TO "About";
CREATE TABLE "new_InfoCard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "bgColor" TEXT NOT NULL,
    "bgImage" TEXT
);
INSERT INTO "new_InfoCard" ("bgColor", "bgImage", "desc", "id", "title") SELECT "bgColor", "bgImage", "desc", "id", "title" FROM "InfoCard";
DROP TABLE "InfoCard";
ALTER TABLE "new_InfoCard" RENAME TO "InfoCard";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
