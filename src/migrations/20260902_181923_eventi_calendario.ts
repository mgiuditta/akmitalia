import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_eventi_tipo" AS ENUM('presentazione', 'stage', 'corso-tecnico', 'esame', 'lezioni-estive', 'festa', 'manifestazione');
  CREATE TYPE "public"."enum__eventi_v_version_tipo" AS ENUM('presentazione', 'stage', 'corso-tecnico', 'esame', 'lezioni-estive', 'festa', 'manifestazione');
  ALTER TABLE "eventi" ADD COLUMN "tipo" "enum_eventi_tipo" DEFAULT 'presentazione';
  ALTER TABLE "_eventi_v" ADD COLUMN "version_tipo" "enum__eventi_v_version_tipo" DEFAULT 'presentazione';
  ALTER TABLE "impostazioni" ADD COLUMN "foto_pagine_eventi_id" integer;
  ALTER TABLE "_impostazioni_v" ADD COLUMN "version_foto_pagine_eventi_id" integer;
  ALTER TABLE "impostazioni" ADD CONSTRAINT "impostazioni_foto_pagine_eventi_id_media_id_fk" FOREIGN KEY ("foto_pagine_eventi_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_impostazioni_v" ADD CONSTRAINT "_impostazioni_v_version_foto_pagine_eventi_id_media_id_fk" FOREIGN KEY ("version_foto_pagine_eventi_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "eventi_tipo_idx" ON "eventi" USING btree ("tipo");
  CREATE INDEX "_eventi_v_version_version_tipo_idx" ON "_eventi_v" USING btree ("version_tipo");
  CREATE INDEX "impostazioni_foto_pagine_foto_pagine_eventi_idx" ON "impostazioni" USING btree ("foto_pagine_eventi_id");
  CREATE INDEX "_impostazioni_v_version_foto_pagine_version_foto_pagin_3_idx" ON "_impostazioni_v" USING btree ("version_foto_pagine_eventi_id");`)

  /* La voce «Eventi» nella barra. Il default del global vale solo per un
     database nuovo: qui si aggiunge a chi ha gia' le quattro voci, prima di
     «Contatti», e solo se non c'e' e se c'e' posto (cinque al massimo). */
  const navigazione = await payload.findGlobal({ slug: 'navigazione', depth: 0, req })
  const voci = navigazione.voci ?? []
  if (!voci.some((v) => v.href === '/eventi') && voci.length < 5) {
    const dove = voci.findIndex((v) => v.href === '/contatti')
    const nuove = [...voci]
    nuove.splice(dove === -1 ? voci.length : dove, 0, { etichetta: 'Eventi', href: '/eventi' })
    await payload.updateGlobal({ slug: 'navigazione', data: { voci: nuove }, req })
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "impostazioni" DROP CONSTRAINT "impostazioni_foto_pagine_eventi_id_media_id_fk";
  
  ALTER TABLE "_impostazioni_v" DROP CONSTRAINT "_impostazioni_v_version_foto_pagine_eventi_id_media_id_fk";
  
  DROP INDEX "eventi_tipo_idx";
  DROP INDEX "_eventi_v_version_version_tipo_idx";
  DROP INDEX "impostazioni_foto_pagine_foto_pagine_eventi_idx";
  DROP INDEX "_impostazioni_v_version_foto_pagine_version_foto_pagin_3_idx";
  ALTER TABLE "eventi" DROP COLUMN "tipo";
  ALTER TABLE "_eventi_v" DROP COLUMN "version_tipo";
  ALTER TABLE "impostazioni" DROP COLUMN "foto_pagine_eventi_id";
  ALTER TABLE "_impostazioni_v" DROP COLUMN "version_foto_pagine_eventi_id";
  DROP TYPE "public"."enum_eventi_tipo";
  DROP TYPE "public"."enum__eventi_v_version_tipo";`)
}
