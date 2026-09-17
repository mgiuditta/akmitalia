import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "impostazioni" ADD COLUMN "video_hero_id" integer;
  ALTER TABLE "_impostazioni_v" ADD COLUMN "version_video_hero_id" integer;
  ALTER TABLE "impostazioni" ADD CONSTRAINT "impostazioni_video_hero_id_media_id_fk" FOREIGN KEY ("video_hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_impostazioni_v" ADD CONSTRAINT "_impostazioni_v_version_video_hero_id_media_id_fk" FOREIGN KEY ("version_video_hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "impostazioni_video_hero_idx" ON "impostazioni" USING btree ("video_hero_id");
  CREATE INDEX "_impostazioni_v_version_version_video_hero_idx" ON "_impostazioni_v" USING btree ("version_video_hero_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "impostazioni" DROP CONSTRAINT "impostazioni_video_hero_id_media_id_fk";
  
  ALTER TABLE "_impostazioni_v" DROP CONSTRAINT "_impostazioni_v_version_video_hero_id_media_id_fk";
  
  DROP INDEX "impostazioni_video_hero_idx";
  DROP INDEX "_impostazioni_v_version_version_video_hero_idx";
  ALTER TABLE "impostazioni" DROP COLUMN "video_hero_id";
  ALTER TABLE "_impostazioni_v" DROP COLUMN "version_video_hero_id";`)
}
