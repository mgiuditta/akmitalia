import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Due testi di serie che il visitatore legge.
 *
 * Il testo del bivio nominava quattro momenti e le righe erano tre: la
 * formazione tecnica non ha un corso, quindi non ha una voce nel bivio
 * (docs/adr/0003), e due centimetri sotto la pagina stampava «3 percorsi».
 * Voce 8 dell'audit antislop 001.
 *
 * Il messaggio di conferma del modulo era senza accenti: «la richiesta e
 * arrivata». Nel momento in cui la richiesta e' andata a buon fine, quella
 * riga si legge come una stringa di sistema. Voce 18 dello stesso audit.
 *
 * Cambia il valore di serie delle colonne e riscrive le righe che hanno ancora
 * quel valore: chi ha gia' riscritto il testo dall'admin non viene toccato.
 */

const VECCHIO =
  'Capisci quale percorso risponde al tuo momento: sicurezza quotidiana, crescita dei ragazzi, antiaggressione e formazione tecnica.'
const NUOVO =
  'Capisci quale percorso risponde al tuo momento: sicurezza quotidiana, crescita dei ragazzi, antiaggressione.'

const CONFERMA_VECCHIA = 'Grazie: la richiesta e arrivata. Ti ricontattiamo entro pochi giorni.'
const CONFERMA_NUOVA = 'Grazie: la richiesta è arrivata. Ti ricontattiamo entro pochi giorni.'

/** Una costante in una `sql` diventa un parametro; in un DDL serve il letterale. */
const letterale = (v: string) => sql.raw(`'${v.replace(/'/g, "''")}'`)

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "impostazioni" ALTER COLUMN "bivio_testo" SET DEFAULT ${letterale(NUOVO)};
    ALTER TABLE "_impostazioni_v" ALTER COLUMN "version_bivio_testo" SET DEFAULT ${letterale(NUOVO)};
    UPDATE "impostazioni" SET "bivio_testo" = ${letterale(NUOVO)} WHERE "bivio_testo" = ${letterale(VECCHIO)};
    UPDATE "_impostazioni_v" SET "version_bivio_testo" = ${letterale(NUOVO)} WHERE "version_bivio_testo" = ${letterale(VECCHIO)};

    ALTER TABLE "contatti" ALTER COLUMN "modulo_messaggio_conferma" SET DEFAULT ${letterale(CONFERMA_NUOVA)};
    ALTER TABLE "_contatti_v" ALTER COLUMN "version_modulo_messaggio_conferma" SET DEFAULT ${letterale(CONFERMA_NUOVA)};
    UPDATE "contatti" SET "modulo_messaggio_conferma" = ${letterale(CONFERMA_NUOVA)} WHERE "modulo_messaggio_conferma" = ${letterale(CONFERMA_VECCHIA)};
    UPDATE "_contatti_v" SET "version_modulo_messaggio_conferma" = ${letterale(CONFERMA_NUOVA)} WHERE "version_modulo_messaggio_conferma" = ${letterale(CONFERMA_VECCHIA)};
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "impostazioni" ALTER COLUMN "bivio_testo" SET DEFAULT ${letterale(VECCHIO)};
    ALTER TABLE "_impostazioni_v" ALTER COLUMN "version_bivio_testo" SET DEFAULT ${letterale(VECCHIO)};
    UPDATE "impostazioni" SET "bivio_testo" = ${letterale(VECCHIO)} WHERE "bivio_testo" = ${letterale(NUOVO)};
    UPDATE "_impostazioni_v" SET "version_bivio_testo" = ${letterale(VECCHIO)} WHERE "version_bivio_testo" = ${letterale(NUOVO)};

    ALTER TABLE "contatti" ALTER COLUMN "modulo_messaggio_conferma" SET DEFAULT ${letterale(CONFERMA_VECCHIA)};
    ALTER TABLE "_contatti_v" ALTER COLUMN "version_modulo_messaggio_conferma" SET DEFAULT ${letterale(CONFERMA_VECCHIA)};
    UPDATE "contatti" SET "modulo_messaggio_conferma" = ${letterale(CONFERMA_VECCHIA)} WHERE "modulo_messaggio_conferma" = ${letterale(CONFERMA_NUOVA)};
    UPDATE "_contatti_v" SET "version_modulo_messaggio_conferma" = ${letterale(CONFERMA_VECCHIA)} WHERE "version_modulo_messaggio_conferma" = ${letterale(CONFERMA_NUOVA)};
  `)
}
