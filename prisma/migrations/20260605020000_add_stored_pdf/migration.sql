-- CreateTable
CREATE TABLE "StoredPdf" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoredPdf_pkey" PRIMARY KEY ("id")
);
