-- CreateTable
CREATE TABLE "PageSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "page" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "backgroundImage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PageSettings_page_key" ON "PageSettings"("page");
