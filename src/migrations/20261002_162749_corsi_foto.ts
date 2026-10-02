import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "corsi" ADD COLUMN "foto_id" integer;
  ALTER TABLE "_corsi_v" ADD COLUMN "version_foto_id" integer;
  ALTER TABLE "corsi" ADD CONSTRAINT "corsi_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_corsi_v" ADD CONSTRAINT "_corsi_v_version_foto_id_media_id_fk" FOREIGN KEY ("version_foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "corsi_foto_idx" ON "corsi" USING btree ("foto_id");
  CREATE INDEX "_corsi_v_version_version_foto_idx" ON "_corsi_v" USING btree ("version_foto_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "corsi" DROP CONSTRAINT "corsi_foto_id_media_id_fk";
  
  ALTER TABLE "_corsi_v" DROP CONSTRAINT "_corsi_v_version_foto_id_media_id_fk";
  
  DROP INDEX "corsi_foto_idx";
  DROP INDEX "_corsi_v_version_version_foto_idx";
  ALTER TABLE "corsi" DROP COLUMN "foto_id";
  ALTER TABLE "_corsi_v" DROP COLUMN "version_foto_id";`)
}
