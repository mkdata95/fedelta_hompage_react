/*
  Warnings:

  - You are about to drop the `NoticeBg` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "NoticeBg";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "MainCard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "icon" TEXT NOT NULL
);
