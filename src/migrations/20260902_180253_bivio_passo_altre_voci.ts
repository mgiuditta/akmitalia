import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "contatti_modulo_altre_voci" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"etichetta" varchar NOT NULL
  );
  
  CREATE TABLE "_contatti_v_version_modulo_altre_voci" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"etichetta" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  ALTER TABLE "impostazioni" ADD COLUMN "bivio_occhiello" varchar DEFAULT 'Prima scelta';
  ALTER TABLE "impostazioni" ADD COLUMN "bivio_titolo" varchar DEFAULT 'Qual è il tuo momento';
  ALTER TABLE "impostazioni" ADD COLUMN "bivio_testo" varchar DEFAULT 'Capisci quale percorso risponde al tuo momento: sicurezza quotidiana, crescita dei ragazzi, antiaggressione e formazione tecnica.';
  ALTER TABLE "impostazioni" ADD COLUMN "home_passo_titolo" varchar DEFAULT 'Prossimo passo';
  ALTER TABLE "impostazioni" ADD COLUMN "home_passo_testo" varchar DEFAULT 'Vuoi capire se AKM fa per te? Scrivici: ti orientiamo sul corso e sulla sede più adatti al tuo obiettivo.';
  ALTER TABLE "impostazioni" ADD COLUMN "home_passo_bottone" varchar DEFAULT 'Richiedi informazioni';
  ALTER TABLE "_impostazioni_v" ADD COLUMN "version_bivio_occhiello" varchar DEFAULT 'Prima scelta';
  ALTER TABLE "_impostazioni_v" ADD COLUMN "version_bivio_titolo" varchar DEFAULT 'Qual è il tuo momento';
  ALTER TABLE "_impostazioni_v" ADD COLUMN "version_bivio_testo" varchar DEFAULT 'Capisci quale percorso risponde al tuo momento: sicurezza quotidiana, crescita dei ragazzi, antiaggressione e formazione tecnica.';
  ALTER TABLE "_impostazioni_v" ADD COLUMN "version_home_passo_titolo" varchar DEFAULT 'Prossimo passo';
  ALTER TABLE "_impostazioni_v" ADD COLUMN "version_home_passo_testo" varchar DEFAULT 'Vuoi capire se AKM fa per te? Scrivici: ti orientiamo sul corso e sulla sede più adatti al tuo obiettivo.';
  ALTER TABLE "_impostazioni_v" ADD COLUMN "version_home_passo_bottone" varchar DEFAULT 'Richiedi informazioni';
  ALTER TABLE "contatti_modulo_altre_voci" ADD CONSTRAINT "contatti_modulo_altre_voci_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contatti"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contatti_v_version_modulo_altre_voci" ADD CONSTRAINT "_contatti_v_version_modulo_altre_voci_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contatti_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "contatti_modulo_altre_voci_order_idx" ON "contatti_modulo_altre_voci" USING btree ("_order");
  CREATE INDEX "contatti_modulo_altre_voci_parent_id_idx" ON "contatti_modulo_altre_voci" USING btree ("_parent_id");
  CREATE INDEX "_contatti_v_version_modulo_altre_voci_order_idx" ON "_contatti_v_version_modulo_altre_voci" USING btree ("_order");
  CREATE INDEX "_contatti_v_version_modulo_altre_voci_parent_id_idx" ON "_contatti_v_version_modulo_altre_voci" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "contatti_modulo_altre_voci" CASCADE;
  DROP TABLE "_contatti_v_version_modulo_altre_voci" CASCADE;
  ALTER TABLE "impostazioni" DROP COLUMN "bivio_occhiello";
  ALTER TABLE "impostazioni" DROP COLUMN "bivio_titolo";
  ALTER TABLE "impostazioni" DROP COLUMN "bivio_testo";
  ALTER TABLE "impostazioni" DROP COLUMN "home_passo_titolo";
  ALTER TABLE "impostazioni" DROP COLUMN "home_passo_testo";
  ALTER TABLE "impostazioni" DROP COLUMN "home_passo_bottone";
  ALTER TABLE "_impostazioni_v" DROP COLUMN "version_bivio_occhiello";
  ALTER TABLE "_impostazioni_v" DROP COLUMN "version_bivio_titolo";
  ALTER TABLE "_impostazioni_v" DROP COLUMN "version_bivio_testo";
  ALTER TABLE "_impostazioni_v" DROP COLUMN "version_home_passo_titolo";
  ALTER TABLE "_impostazioni_v" DROP COLUMN "version_home_passo_testo";
  ALTER TABLE "_impostazioni_v" DROP COLUMN "version_home_passo_bottone";`)
}
