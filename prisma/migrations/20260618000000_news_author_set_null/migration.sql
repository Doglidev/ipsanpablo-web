-- Permite borrar un usuario que escribió noticias sin violar la FK:
-- el autor pasa a NULL en lugar de bloquear el borrado.

-- DropForeignKey
ALTER TABLE "NewsArticle" DROP CONSTRAINT "NewsArticle_authorId_fkey";

-- AlterTable
ALTER TABLE "NewsArticle" ALTER COLUMN "authorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "NewsArticle" ADD CONSTRAINT "NewsArticle_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
