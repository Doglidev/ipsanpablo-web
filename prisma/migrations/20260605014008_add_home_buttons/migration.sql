-- CreateTable
CREATE TABLE "HomeButton" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL DEFAULT '',
    "downloadName" TEXT NOT NULL DEFAULT '',
    "color" TEXT NOT NULL DEFAULT 'sky',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "HomeButton_pkey" PRIMARY KEY ("id")
);
