-- CreateTable
CREATE TABLE "About" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "visionTitle" TEXT NOT NULL,
    "visionContent" TEXT NOT NULL,
    "valuesTitle" TEXT NOT NULL,
    "valuesItems" TEXT NOT NULL,
    "logo" TEXT,
    "greetingsTitle" TEXT,
    "greetingsDesc" TEXT,
    "logoAlign" TEXT,

    CONSTRAINT "About_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotoCard" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "PhotoCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "details" TEXT,
    "category" TEXT,
    "client" TEXT,
    "size" TEXT,
    "role" TEXT,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notice" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Notice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MainCard" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "MainCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InfoCard" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "bgColor" TEXT NOT NULL,
    "bgImage" TEXT,

    CONSTRAINT "InfoCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageSettings" (
    "id" SERIAL NOT NULL,
    "page" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "backgroundImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PageSettings_page_key" ON "PageSettings"("page");
