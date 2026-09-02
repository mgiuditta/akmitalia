import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "impostazioni_home_prima_volta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titolo" varchar NOT NULL,
  	"testo" varchar NOT NULL
  );
  
  CREATE TABLE "_impostazioni_v_version_home_prima_volta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"titolo" varchar NOT NULL,
  	"testo" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "navigazione_piede" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"etichetta" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "_navigazione_v_version_piede" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"etichetta" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  ALTER TABLE "contatti" ADD COLUMN "modulo_nota" varchar DEFAULT 'Tutti i campi sono obbligatori, tranne percorso e messaggio.';
  ALTER TABLE "contatti" ADD COLUMN "modulo_etichetta_consenso" varchar DEFAULT 'Autorizzo il trattamento dei dati personali secondo il Regolamento UE 2016/679, per essere ricontattato da AKM Italia.';
  ALTER TABLE "contatti" ADD COLUMN "modulo_pagina_privacy_id" integer;
  ALTER TABLE "contatti" ADD COLUMN "modulo_etichetta_invio" varchar DEFAULT 'Invia la richiesta';
  ALTER TABLE "contatti" ADD COLUMN "modulo_messaggio_conferma" varchar DEFAULT 'Grazie: la richiesta e arrivata. Ti ricontattiamo entro pochi giorni.';
  ALTER TABLE "contatti" ADD COLUMN "modulo_chiedi_data_nascita" boolean DEFAULT true;
  ALTER TABLE "contatti" ADD COLUMN "modulo_chiedi_percorso" boolean DEFAULT true;
  ALTER TABLE "contatti" ADD COLUMN "modulo_chiedi_messaggio" boolean DEFAULT true;
  ALTER TABLE "_contatti_v" ADD COLUMN "version_modulo_nota" varchar DEFAULT 'Tutti i campi sono obbligatori, tranne percorso e messaggio.';
  ALTER TABLE "_contatti_v" ADD COLUMN "version_modulo_etichetta_consenso" varchar DEFAULT 'Autorizzo il trattamento dei dati personali secondo il Regolamento UE 2016/679, per essere ricontattato da AKM Italia.';
  ALTER TABLE "_contatti_v" ADD COLUMN "version_modulo_pagina_privacy_id" integer;
  ALTER TABLE "_contatti_v" ADD COLUMN "version_modulo_etichetta_invio" varchar DEFAULT 'Invia la richiesta';
  ALTER TABLE "_contatti_v" ADD COLUMN "version_modulo_messaggio_conferma" varchar DEFAULT 'Grazie: la richiesta e arrivata. Ti ricontattiamo entro pochi giorni.';
  ALTER TABLE "_contatti_v" ADD COLUMN "version_modulo_chiedi_data_nascita" boolean DEFAULT true;
  ALTER TABLE "_contatti_v" ADD COLUMN "version_modulo_chiedi_percorso" boolean DEFAULT true;
  ALTER TABLE "_contatti_v" ADD COLUMN "version_modulo_chiedi_messaggio" boolean DEFAULT true;
  ALTER TABLE "impostazioni" ADD COLUMN "home_testo_qualifiche" varchar;
  ALTER TABLE "_impostazioni_v" ADD COLUMN "version_home_testo_qualifiche" varchar;
  ALTER TABLE "impostazioni_home_prima_volta" ADD CONSTRAINT "impostazioni_home_prima_volta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."impostazioni"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_impostazioni_v_version_home_prima_volta" ADD CONSTRAINT "_impostazioni_v_version_home_prima_volta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_impostazioni_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigazione_piede" ADD CONSTRAINT "navigazione_piede_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigazione"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigazione_v_version_piede" ADD CONSTRAINT "_navigazione_v_version_piede_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigazione_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "impostazioni_home_prima_volta_order_idx" ON "impostazioni_home_prima_volta" USING btree ("_order");
  CREATE INDEX "impostazioni_home_prima_volta_parent_id_idx" ON "impostazioni_home_prima_volta" USING btree ("_parent_id");
  CREATE INDEX "_impostazioni_v_version_home_prima_volta_order_idx" ON "_impostazioni_v_version_home_prima_volta" USING btree ("_order");
  CREATE INDEX "_impostazioni_v_version_home_prima_volta_parent_id_idx" ON "_impostazioni_v_version_home_prima_volta" USING btree ("_parent_id");
  CREATE INDEX "navigazione_piede_order_idx" ON "navigazione_piede" USING btree ("_order");
  CREATE INDEX "navigazione_piede_parent_id_idx" ON "navigazione_piede" USING btree ("_parent_id");
  CREATE INDEX "_navigazione_v_version_piede_order_idx" ON "_navigazione_v_version_piede" USING btree ("_order");
  CREATE INDEX "_navigazione_v_version_piede_parent_id_idx" ON "_navigazione_v_version_piede" USING btree ("_parent_id");
  ALTER TABLE "contatti" ADD CONSTRAINT "contatti_modulo_pagina_privacy_id_pagine_id_fk" FOREIGN KEY ("modulo_pagina_privacy_id") REFERENCES "public"."pagine"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contatti_v" ADD CONSTRAINT "_contatti_v_version_modulo_pagina_privacy_id_pagine_id_fk" FOREIGN KEY ("version_modulo_pagina_privacy_id") REFERENCES "public"."pagine"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "contatti_modulo_modulo_pagina_privacy_idx" ON "contatti" USING btree ("modulo_pagina_privacy_id");
  CREATE INDEX "_contatti_v_version_modulo_version_modulo_pagina_privacy_idx" ON "_contatti_v" USING btree ("version_modulo_pagina_privacy_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "impostazioni_home_prima_volta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_impostazioni_v_version_home_prima_volta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigazione_piede" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_navigazione_v_version_piede" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "impostazioni_home_prima_volta" CASCADE;
  DROP TABLE "_impostazioni_v_version_home_prima_volta" CASCADE;
  DROP TABLE "navigazione_piede" CASCADE;
  DROP TABLE "_navigazione_v_version_piede" CASCADE;
  ALTER TABLE "contatti" DROP CONSTRAINT "contatti_modulo_pagina_privacy_id_pagine_id_fk";
  
  ALTER TABLE "_contatti_v" DROP CONSTRAINT "_contatti_v_version_modulo_pagina_privacy_id_pagine_id_fk";
  
  DROP INDEX "contatti_modulo_modulo_pagina_privacy_idx";
  DROP INDEX "_contatti_v_version_modulo_version_modulo_pagina_privacy_idx";
  ALTER TABLE "contatti" DROP COLUMN "modulo_nota";
  ALTER TABLE "contatti" DROP COLUMN "modulo_etichetta_consenso";
  ALTER TABLE "contatti" DROP COLUMN "modulo_pagina_privacy_id";
  ALTER TABLE "contatti" DROP COLUMN "modulo_etichetta_invio";
  ALTER TABLE "contatti" DROP COLUMN "modulo_messaggio_conferma";
  ALTER TABLE "contatti" DROP COLUMN "modulo_chiedi_data_nascita";
  ALTER TABLE "contatti" DROP COLUMN "modulo_chiedi_percorso";
  ALTER TABLE "contatti" DROP COLUMN "modulo_chiedi_messaggio";
  ALTER TABLE "_contatti_v" DROP COLUMN "version_modulo_nota";
  ALTER TABLE "_contatti_v" DROP COLUMN "version_modulo_etichetta_consenso";
  ALTER TABLE "_contatti_v" DROP COLUMN "version_modulo_pagina_privacy_id";
  ALTER TABLE "_contatti_v" DROP COLUMN "version_modulo_etichetta_invio";
  ALTER TABLE "_contatti_v" DROP COLUMN "version_modulo_messaggio_conferma";
  ALTER TABLE "_contatti_v" DROP COLUMN "version_modulo_chiedi_data_nascita";
  ALTER TABLE "_contatti_v" DROP COLUMN "version_modulo_chiedi_percorso";
  ALTER TABLE "_contatti_v" DROP COLUMN "version_modulo_chiedi_messaggio";
  ALTER TABLE "impostazioni" DROP COLUMN "home_testo_qualifiche";
  ALTER TABLE "_impostazioni_v" DROP COLUMN "version_home_testo_qualifiche";`)
}
