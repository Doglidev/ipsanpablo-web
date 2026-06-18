-- Navbar dinámico: tabla de grupos + columnas navPath / navLabel en Section.

-- AlterTable
ALTER TABLE "Section" ADD COLUMN "navPath" TEXT;
ALTER TABLE "Section" ADD COLUMN "navLabel" TEXT;

-- CreateTable
CREATE TABLE "NavGroup" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NavGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NavGroup_slug_key" ON "NavGroup"("slug");

-- Datos iniciales: grupos que reflejan el navbar actual.
INSERT INTO "NavGroup" ("id", "slug", "label", "href", "sortOrder", "isVisible", "createdAt", "updatedAt") VALUES
    ('navgrp-institucional', 'institucional', 'Institucional', NULL,         0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('navgrp-niveles',       'niveles',       'Niveles',       NULL,         1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('navgrp-becas',         'becas',         'Becas',         NULL,         2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('navgrp-pasantias',     'pasantias',     'Pasantías',     NULL,         3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('navgrp-secretarias',   'secretarias',   'Secretarías',   NULL,         4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('navgrp-administracion','administracion','Administración',NULL,         5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('navgrp-pastoral',      'pastoral',      'Pastoral',      NULL,         6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('navgrp-noticias',      'noticias',      'Noticias',      '/noticias',  7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('navgrp-contacto',      'contacto',      'Contacto',      '/contacto',  8, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Ruta pública, etiqueta de menú y orden de las secciones existentes
-- (preserva exactamente el navbar actual).
UPDATE "Section" SET "navPath" = '/institucional/nuestra-escuela',   "navLabel" = 'Nuestra Escuela',       "sortOrder" = 0 WHERE "slug" = 'nuestra-escuela';
UPDATE "Section" SET "navPath" = '/institucional/autoridades',       "navLabel" = 'Autoridades',           "sortOrder" = 1 WHERE "slug" = 'autoridades';
UPDATE "Section" SET "navPath" = '/institucional/galeria',           "navLabel" = 'Galería',               "sortOrder" = 2 WHERE "slug" = 'galeria-institucional';
UPDATE "Section" SET "navPath" = '/niveles/inicial',                 "navLabel" = 'Inicial',               "sortOrder" = 0 WHERE "slug" = 'nivel-inicial';
UPDATE "Section" SET "navPath" = '/niveles/primario',                "navLabel" = 'Primario',              "sortOrder" = 1 WHERE "slug" = 'nivel-primario';
UPDATE "Section" SET "navPath" = '/niveles/secundario',              "navLabel" = 'Secundario',            "sortOrder" = 2 WHERE "slug" = 'nivel-secundario';
UPDATE "Section" SET "navPath" = '/becas',                           "navLabel" = 'Becas',                 "sortOrder" = 0 WHERE "slug" = 'becas';
UPDATE "Section" SET "navPath" = '/pasantias/objetivo',              "navLabel" = 'Objetivo',              "sortOrder" = 0 WHERE "slug" = 'pasantias-objetivo';
UPDATE "Section" SET "navPath" = '/pasantias/espacios-curriculares', "navLabel" = 'Espacios Curriculares', "sortOrder" = 1 WHERE "slug" = 'pasantias-espacios-curriculares';
UPDATE "Section" SET "navPath" = '/pasantias/lugares',               "navLabel" = 'Lugares',               "sortOrder" = 2 WHERE "slug" = 'pasantias-lugares';
UPDATE "Section" SET "navPath" = '/pasantias/monitoreo',             "navLabel" = 'Monitoreo y Evaluación', "sortOrder" = 3 WHERE "slug" = 'pasantias-monitoreo';
UPDATE "Section" SET "navPath" = '/secretarias/inicial-primario',    "navLabel" = 'Inicial y Primario',    "sortOrder" = 0 WHERE "slug" = 'secretaria-inicial-primario';
UPDATE "Section" SET "navPath" = '/secretarias/secundario',          "navLabel" = 'Secundario',            "sortOrder" = 1 WHERE "slug" = 'secretaria-secundario';
UPDATE "Section" SET "navPath" = '/administracion',                  "navLabel" = 'Administración',        "sortOrder" = 0 WHERE "slug" = 'administracion';
UPDATE "Section" SET "navPath" = '/pastoral/info',                   "navLabel" = 'Información',            "sortOrder" = 0 WHERE "slug" = 'pastoral-info';
UPDATE "Section" SET "navPath" = '/pastoral/galeria',                "navLabel" = 'Galería',               "sortOrder" = 1 WHERE "slug" = 'pastoral-galeria';
