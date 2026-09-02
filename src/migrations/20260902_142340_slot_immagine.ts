import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "impostazioni" ADD COLUMN "home_immagine_ingresso_id" integer;
  ALTER TABLE "impostazioni" ADD COLUMN "foto_pagine_centri_id" integer;
  ALTER TABLE "impostazioni" ADD COLUMN "foto_pagine_corsi_id" integer;
  ALTER TABLE "impostazioni" ADD COLUMN "foto_pagine_istruttori_id" integer;
  ALTER TABLE "_impostazioni_v" ADD COLUMN "version_home_immagine_ingresso_id" integer;
  ALTER TABLE "_impostazioni_v" ADD COLUMN "version_foto_pagine_centri_id" integer;
  ALTER TABLE "_impostazioni_v" ADD COLUMN "version_foto_pagine_corsi_id" integer;
  ALTER TABLE "_impostazioni_v" ADD COLUMN "version_foto_pagine_istruttori_id" integer;
  ALTER TABLE "impostazioni" ADD CONSTRAINT "impostazioni_home_immagine_ingresso_id_media_id_fk" FOREIGN KEY ("home_immagine_ingresso_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "impostazioni" ADD CONSTRAINT "impostazioni_foto_pagine_centri_id_media_id_fk" FOREIGN KEY ("foto_pagine_centri_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "impostazioni" ADD CONSTRAINT "impostazioni_foto_pagine_corsi_id_media_id_fk" FOREIGN KEY ("foto_pagine_corsi_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "impostazioni" ADD CONSTRAINT "impostazioni_foto_pagine_istruttori_id_media_id_fk" FOREIGN KEY ("foto_pagine_istruttori_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_impostazioni_v" ADD CONSTRAINT "_impostazioni_v_version_home_immagine_ingresso_id_media_id_fk" FOREIGN KEY ("version_home_immagine_ingresso_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_impostazioni_v" ADD CONSTRAINT "_impostazioni_v_version_foto_pagine_centri_id_media_id_fk" FOREIGN KEY ("version_foto_pagine_centri_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_impostazioni_v" ADD CONSTRAINT "_impostazioni_v_version_foto_pagine_corsi_id_media_id_fk" FOREIGN KEY ("version_foto_pagine_corsi_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_impostazioni_v" ADD CONSTRAINT "_impostazioni_v_version_foto_pagine_istruttori_id_media_id_fk" FOREIGN KEY ("version_foto_pagine_istruttori_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "impostazioni_home_home_immagine_ingresso_idx" ON "impostazioni" USING btree ("home_immagine_ingresso_id");
  CREATE INDEX "impostazioni_foto_pagine_foto_pagine_centri_idx" ON "impostazioni" USING btree ("foto_pagine_centri_id");
  CREATE INDEX "impostazioni_foto_pagine_foto_pagine_corsi_idx" ON "impostazioni" USING btree ("foto_pagine_corsi_id");
  CREATE INDEX "impostazioni_foto_pagine_foto_pagine_istruttori_idx" ON "impostazioni" USING btree ("foto_pagine_istruttori_id");
  CREATE INDEX "_impostazioni_v_version_home_version_home_immagine_ingre_idx" ON "_impostazioni_v" USING btree ("version_home_immagine_ingresso_id");
  CREATE INDEX "_impostazioni_v_version_foto_pagine_version_foto_pagine__idx" ON "_impostazioni_v" USING btree ("version_foto_pagine_centri_id");
  CREATE INDEX "_impostazioni_v_version_foto_pagine_version_foto_pagin_1_idx" ON "_impostazioni_v" USING btree ("version_foto_pagine_corsi_id");
  CREATE INDEX "_impostazioni_v_version_foto_pagine_version_foto_pagin_2_idx" ON "_impostazioni_v" USING btree ("version_foto_pagine_istruttori_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "impostazioni" DROP CONSTRAINT "impostazioni_home_immagine_ingresso_id_media_id_fk";
  
  ALTER TABLE "impostazioni" DROP CONSTRAINT "impostazioni_foto_pagine_centri_id_media_id_fk";
  
  ALTER TABLE "impostazioni" DROP CONSTRAINT "impostazioni_foto_pagine_corsi_id_media_id_fk";
  
  ALTER TABLE "impostazioni" DROP CONSTRAINT "impostazioni_foto_pagine_istruttori_id_media_id_fk";
  
  ALTER TABLE "_impostazioni_v" DROP CONSTRAINT "_impostazioni_v_version_home_immagine_ingresso_id_media_id_fk";
  
  ALTER TABLE "_impostazioni_v" DROP CONSTRAINT "_impostazioni_v_version_foto_pagine_centri_id_media_id_fk";
  
  ALTER TABLE "_impostazioni_v" DROP CONSTRAINT "_impostazioni_v_version_foto_pagine_corsi_id_media_id_fk";
  
  ALTER TABLE "_impostazioni_v" DROP CONSTRAINT "_impostazioni_v_version_foto_pagine_istruttori_id_media_id_fk";
  
  DROP INDEX "impostazioni_home_home_immagine_ingresso_idx";
  DROP INDEX "impostazioni_foto_pagine_foto_pagine_centri_idx";
  DROP INDEX "impostazioni_foto_pagine_foto_pagine_corsi_idx";
  DROP INDEX "impostazioni_foto_pagine_foto_pagine_istruttori_idx";
  DROP INDEX "_impostazioni_v_version_home_version_home_immagine_ingre_idx";
  DROP INDEX "_impostazioni_v_version_foto_pagine_version_foto_pagine__idx";
  DROP INDEX "_impostazioni_v_version_foto_pagine_version_foto_pagin_1_idx";
  DROP INDEX "_impostazioni_v_version_foto_pagine_version_foto_pagin_2_idx";
  ALTER TABLE "impostazioni" DROP COLUMN "home_immagine_ingresso_id";
  ALTER TABLE "impostazioni" DROP COLUMN "foto_pagine_centri_id";
  ALTER TABLE "impostazioni" DROP COLUMN "foto_pagine_corsi_id";
  ALTER TABLE "impostazioni" DROP COLUMN "foto_pagine_istruttori_id";
  ALTER TABLE "_impostazioni_v" DROP COLUMN "version_home_immagine_ingresso_id";
  ALTER TABLE "_impostazioni_v" DROP COLUMN "version_foto_pagine_centri_id";
  ALTER TABLE "_impostazioni_v" DROP COLUMN "version_foto_pagine_corsi_id";
  ALTER TABLE "_impostazioni_v" DROP COLUMN "version_foto_pagine_istruttori_id";`)
}
