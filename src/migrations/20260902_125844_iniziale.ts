import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('it');
  CREATE TYPE "public"."enum_pagine_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pagine_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pagine_v_published_locale" AS ENUM('it');
  CREATE TYPE "public"."enum_news_tipo" AS ENUM('notizia', 'stage-seminario', 'rassegna-stampa', 'comunicato');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_tipo" AS ENUM('notizia', 'stage-seminario', 'rassegna-stampa', 'comunicato');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_published_locale" AS ENUM('it');
  CREATE TYPE "public"."enum_eventi_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__eventi_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__eventi_v_published_locale" AS ENUM('it');
  CREATE TYPE "public"."enum_corsi_target" AS ENUM('adulti', 'ragazzi', 'bambini', 'donne', 'istruttori', 'aziende-ffoo');
  CREATE TYPE "public"."enum_corsi_superficie" AS ENUM('nero', 'carbone', 'bianco', 'grigio');
  CREATE TYPE "public"."enum_corsi_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__corsi_v_version_target" AS ENUM('adulti', 'ragazzi', 'bambini', 'donne', 'istruttori', 'aziende-ffoo');
  CREATE TYPE "public"."enum__corsi_v_version_superficie" AS ENUM('nero', 'carbone', 'bianco', 'grigio');
  CREATE TYPE "public"."enum__corsi_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__corsi_v_published_locale" AS ENUM('it');
  CREATE TYPE "public"."enum_sedi_orari_giorni" AS ENUM('lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom');
  CREATE TYPE "public"."enum_sedi_indirizzo_nazione" AS ENUM('IT', 'CH');
  CREATE TYPE "public"."enum_sedi_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__sedi_v_version_orari_giorni" AS ENUM('lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom');
  CREATE TYPE "public"."enum__sedi_v_version_indirizzo_nazione" AS ENUM('IT', 'CH');
  CREATE TYPE "public"."enum__sedi_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__sedi_v_published_locale" AS ENUM('it');
  CREATE TYPE "public"."enum_istruttori_qualifica" AS ENUM('istruttore', 'trainer', 'maestro', 'direttore-tecnico', 'presidente');
  CREATE TYPE "public"."enum_istruttori_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__istruttori_v_version_qualifica" AS ENUM('istruttore', 'trainer', 'maestro', 'direttore-tecnico', 'presidente');
  CREATE TYPE "public"."enum__istruttori_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__istruttori_v_published_locale" AS ENUM('it');
  CREATE TYPE "public"."enum_richieste_stato" AS ENUM('nuova', 'contattata', 'iscritta', 'archiviata');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_contatti_social_rete" AS ENUM('facebook', 'instagram', 'youtube', 'tiktok', 'linkedin');
  CREATE TYPE "public"."enum__contatti_v_version_social_rete" AS ENUM('facebook', 'instagram', 'youtube', 'tiktok', 'linkedin');
  CREATE TABLE "pagine_sezioni" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titolo" varchar,
  	"testo" jsonb
  );
  
  CREATE TABLE "pagine" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titolo" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"parent_id" integer,
  	"path" varchar,
  	"occhiello" varchar,
  	"sommario" varchar,
  	"immagine_hero_id" integer,
  	"legacy_wp_id" numeric,
  	"legacy_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pagine_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pagine_locales" (
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pagine_v_version_sezioni" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"titolo" varchar,
  	"testo" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pagine_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titolo" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_parent_id" integer,
  	"version_path" varchar,
  	"version_occhiello" varchar,
  	"version_sommario" varchar,
  	"version_immagine_hero_id" integer,
  	"version_legacy_wp_id" numeric,
  	"version_legacy_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pagine_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pagine_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_pagine_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titolo" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"data" timestamp(3) with time zone,
  	"tipo" "enum_news_tipo" DEFAULT 'notizia',
  	"copertina_id" integer,
  	"estratto" varchar,
  	"contenuto" jsonb,
  	"legacy_wp_id" numeric,
  	"legacy_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "news_locales" (
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "news_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sedi_id" integer,
  	"istruttori_id" integer
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titolo" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_data" timestamp(3) with time zone,
  	"version_tipo" "enum__news_v_version_tipo" DEFAULT 'notizia',
  	"version_copertina_id" integer,
  	"version_estratto" varchar,
  	"version_contenuto" jsonb,
  	"version_legacy_wp_id" numeric,
  	"version_legacy_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__news_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_news_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_news_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sedi_id" integer,
  	"istruttori_id" integer
  );
  
  CREATE TABLE "eventi" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titolo" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"data_inizio" timestamp(3) with time zone,
  	"data_fine" timestamp(3) with time zone,
  	"sede_id" integer,
  	"luogo" varchar,
  	"copertina_id" integer,
  	"estratto" varchar,
  	"descrizione" jsonb,
  	"cta_link" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_eventi_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "eventi_locales" (
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "eventi_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"corsi_id" integer
  );
  
  CREATE TABLE "_eventi_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titolo" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_data_inizio" timestamp(3) with time zone,
  	"version_data_fine" timestamp(3) with time zone,
  	"version_sede_id" integer,
  	"version_luogo" varchar,
  	"version_copertina_id" integer,
  	"version_estratto" varchar,
  	"version_descrizione" jsonb,
  	"version_cta_link" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__eventi_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__eventi_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_eventi_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_eventi_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"corsi_id" integer
  );
  
  CREATE TABLE "corsi_focus" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"voce" varchar
  );
  
  CREATE TABLE "corsi_risultati" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"voce" varchar
  );
  
  CREATE TABLE "corsi_adatto_a" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"voce" varchar
  );
  
  CREATE TABLE "corsi" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"target" "enum_corsi_target",
  	"ordine" numeric DEFAULT 0,
  	"superficie" "enum_corsi_superficie" DEFAULT 'grigio',
  	"in_bivio" boolean DEFAULT false,
  	"domanda" varchar,
  	"occhiello" varchar,
  	"a_chi_si_rivolge" varchar,
  	"sommario" varchar,
  	"descrizione" jsonb,
  	"durata" varchar,
  	"ingresso" varchar,
  	"cadenza" varchar,
  	"prova" varchar,
  	"azione" varchar DEFAULT 'Chiedi una prova',
  	"immagine_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_corsi_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "corsi_locales" (
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_corsi_v_version_focus" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"voce" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_corsi_v_version_risultati" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"voce" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_corsi_v_version_adatto_a" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"voce" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_corsi_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_nome" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_target" "enum__corsi_v_version_target",
  	"version_ordine" numeric DEFAULT 0,
  	"version_superficie" "enum__corsi_v_version_superficie" DEFAULT 'grigio',
  	"version_in_bivio" boolean DEFAULT false,
  	"version_domanda" varchar,
  	"version_occhiello" varchar,
  	"version_a_chi_si_rivolge" varchar,
  	"version_sommario" varchar,
  	"version_descrizione" jsonb,
  	"version_durata" varchar,
  	"version_ingresso" varchar,
  	"version_cadenza" varchar,
  	"version_prova" varchar,
  	"version_azione" varchar DEFAULT 'Chiedi una prova',
  	"version_immagine_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__corsi_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__corsi_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_corsi_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "sedi_orari_giorni" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_sedi_orari_giorni",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "sedi_orari" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"disciplina_id" integer,
  	"ora_inizio" varchar,
  	"ora_fine" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "sedi" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"palestra" varchar,
  	"indirizzo_via" varchar,
  	"indirizzo_cap" varchar,
  	"indirizzo_citta" varchar,
  	"indirizzo_provincia" varchar,
  	"indirizzo_nazione" "enum_sedi_indirizzo_nazione" DEFAULT 'IT',
  	"coordinate_lat" numeric,
  	"coordinate_lng" numeric,
  	"maps_url" varchar,
  	"attivo" boolean DEFAULT true,
  	"descrizione" varchar,
  	"foto_id" integer,
  	"legacy_wp_id" numeric,
  	"legacy_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_sedi_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "sedi_locales" (
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "sedi_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"istruttori_id" integer
  );
  
  CREATE TABLE "_sedi_v_version_orari_giorni" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__sedi_v_version_orari_giorni",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_sedi_v_version_orari" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"disciplina_id" integer,
  	"ora_inizio" varchar,
  	"ora_fine" varchar,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_sedi_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_nome" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_palestra" varchar,
  	"version_indirizzo_via" varchar,
  	"version_indirizzo_cap" varchar,
  	"version_indirizzo_citta" varchar,
  	"version_indirizzo_provincia" varchar,
  	"version_indirizzo_nazione" "enum__sedi_v_version_indirizzo_nazione" DEFAULT 'IT',
  	"version_coordinate_lat" numeric,
  	"version_coordinate_lng" numeric,
  	"version_maps_url" varchar,
  	"version_attivo" boolean DEFAULT true,
  	"version_descrizione" varchar,
  	"version_foto_id" integer,
  	"version_legacy_wp_id" numeric,
  	"version_legacy_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__sedi_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__sedi_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_sedi_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_sedi_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"istruttori_id" integer
  );
  
  CREATE TABLE "istruttori_credenziali" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"voce" varchar
  );
  
  CREATE TABLE "istruttori_focus" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"voce" varchar
  );
  
  CREATE TABLE "istruttori" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"nome_breve" varchar,
  	"ordine" numeric DEFAULT 0,
  	"ruolo" varchar,
  	"qualifica" "enum_istruttori_qualifica",
  	"grado" varchar,
  	"livello" varchar,
  	"foto_id" integer,
  	"sommario" varchar,
  	"bio" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_istruttori_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "istruttori_locales" (
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_istruttori_v_version_credenziali" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"voce" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_istruttori_v_version_focus" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"voce" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_istruttori_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_nome" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_nome_breve" varchar,
  	"version_ordine" numeric DEFAULT 0,
  	"version_ruolo" varchar,
  	"version_qualifica" "enum__istruttori_v_version_qualifica",
  	"version_grado" varchar,
  	"version_livello" varchar,
  	"version_foto_id" integer,
  	"version_sommario" varchar,
  	"version_bio" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__istruttori_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__istruttori_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_istruttori_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "richieste" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"stato" "enum_richieste_stato" DEFAULT 'nuova' NOT NULL,
  	"note" varchar,
  	"email_inviata" boolean DEFAULT false,
  	"cognome" varchar NOT NULL,
  	"nome" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"telefono" varchar,
  	"data_nascita" timestamp(3) with time zone,
  	"sede_id" integer,
  	"sede_indicata" varchar,
  	"corso_id" integer,
  	"corso_indicato" varchar,
  	"messaggio" varchar,
  	"consenso" boolean DEFAULT false NOT NULL,
  	"consenso_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"didascalia" varchar,
  	"legacy_wp_id" numeric,
  	"legacy_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "utenti_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "utenti" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pagine_id" integer,
  	"news_id" integer,
  	"eventi_id" integer,
  	"corsi_id" integer,
  	"sedi_id" integer,
  	"istruttori_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pagine_id" integer,
  	"news_id" integer,
  	"eventi_id" integer,
  	"corsi_id" integer,
  	"sedi_id" integer,
  	"istruttori_id" integer,
  	"richieste_id" integer,
  	"media_id" integer,
  	"utenti_id" integer,
  	"redirects_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"utenti_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contatti_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rete" "enum_contatti_social_rete" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "contatti" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"telefono" varchar,
  	"whatsapp" varchar,
  	"email_richieste" varchar DEFAULT 'formazione@akm-italia.eu',
  	"intro_richieste" varchar,
  	"immagine_contatti_id" integer,
  	"sede_legale_via" varchar,
  	"sede_legale_cap" varchar,
  	"sede_legale_citta" varchar,
  	"sede_legale_provincia" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_contatti_v_version_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rete" "enum__contatti_v_version_social_rete" NOT NULL,
  	"url" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contatti_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_email" varchar NOT NULL,
  	"version_telefono" varchar,
  	"version_whatsapp" varchar,
  	"version_email_richieste" varchar DEFAULT 'formazione@akm-italia.eu',
  	"version_intro_richieste" varchar,
  	"version_immagine_contatti_id" integer,
  	"version_sede_legale_via" varchar,
  	"version_sede_legale_cap" varchar,
  	"version_sede_legale_citta" varchar,
  	"version_sede_legale_provincia" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "impostazioni" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'AKM Italia' NOT NULL,
  	"logo_id" integer,
  	"og_image_id" integer,
  	"immagine_hero_id" integer,
  	"eroe_occhiello" varchar DEFAULT 'Krav Maga · Milano, Monza e Brianza, Lodi, Varese',
  	"eroe_titolo" varchar DEFAULT 'Difendersi si impara',
  	"eroe_testo" varchar,
  	"eroe_cta_primaria_etichetta" varchar DEFAULT 'Scegli il tuo percorso',
  	"eroe_cta_primaria_href" varchar DEFAULT '#percorsi',
  	"eroe_cta_secondaria_etichetta" varchar DEFAULT 'Trova un centro',
  	"eroe_cta_secondaria_href" varchar DEFAULT '/centri',
  	"testo_footer" varchar,
  	"dati_fiscali_ragione_sociale" varchar,
  	"dati_fiscali_codice_fiscale" varchar,
  	"dati_fiscali_partita_iva" varchar,
  	"dati_fiscali_iban" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_impostazioni_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_site_name" varchar DEFAULT 'AKM Italia' NOT NULL,
  	"version_logo_id" integer,
  	"version_og_image_id" integer,
  	"version_immagine_hero_id" integer,
  	"version_eroe_occhiello" varchar DEFAULT 'Krav Maga · Milano, Monza e Brianza, Lodi, Varese',
  	"version_eroe_titolo" varchar DEFAULT 'Difendersi si impara',
  	"version_eroe_testo" varchar,
  	"version_eroe_cta_primaria_etichetta" varchar DEFAULT 'Scegli il tuo percorso',
  	"version_eroe_cta_primaria_href" varchar DEFAULT '#percorsi',
  	"version_eroe_cta_secondaria_etichetta" varchar DEFAULT 'Trova un centro',
  	"version_eroe_cta_secondaria_href" varchar DEFAULT '/centri',
  	"version_testo_footer" varchar,
  	"version_dati_fiscali_ragione_sociale" varchar,
  	"version_dati_fiscali_codice_fiscale" varchar,
  	"version_dati_fiscali_partita_iva" varchar,
  	"version_dati_fiscali_iban" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "navigazione_voci" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"etichetta" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigazione" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_etichetta" varchar DEFAULT 'Richiedi informazioni' NOT NULL,
  	"cta_href" varchar DEFAULT '/contatti' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_navigazione_v_version_voci" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"etichetta" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigazione_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_cta_etichetta" varchar DEFAULT 'Richiedi informazioni' NOT NULL,
  	"version_cta_href" varchar DEFAULT '/contatti' NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "pagine_sezioni" ADD CONSTRAINT "pagine_sezioni_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagine"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pagine" ADD CONSTRAINT "pagine_parent_id_pagine_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pagine"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pagine" ADD CONSTRAINT "pagine_immagine_hero_id_media_id_fk" FOREIGN KEY ("immagine_hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pagine_locales" ADD CONSTRAINT "pagine_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pagine_locales" ADD CONSTRAINT "pagine_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagine"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pagine_v_version_sezioni" ADD CONSTRAINT "_pagine_v_version_sezioni_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pagine_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pagine_v" ADD CONSTRAINT "_pagine_v_parent_id_pagine_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pagine"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pagine_v" ADD CONSTRAINT "_pagine_v_version_parent_id_pagine_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."pagine"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pagine_v" ADD CONSTRAINT "_pagine_v_version_immagine_hero_id_media_id_fk" FOREIGN KEY ("version_immagine_hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pagine_v_locales" ADD CONSTRAINT "_pagine_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pagine_v_locales" ADD CONSTRAINT "_pagine_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pagine_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_copertina_id_media_id_fk" FOREIGN KEY ("copertina_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_locales" ADD CONSTRAINT "news_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_locales" ADD CONSTRAINT "news_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_sedi_fk" FOREIGN KEY ("sedi_id") REFERENCES "public"."sedi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_istruttori_fk" FOREIGN KEY ("istruttori_id") REFERENCES "public"."istruttori"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_copertina_id_media_id_fk" FOREIGN KEY ("version_copertina_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_locales" ADD CONSTRAINT "_news_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_locales" ADD CONSTRAINT "_news_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_sedi_fk" FOREIGN KEY ("sedi_id") REFERENCES "public"."sedi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_istruttori_fk" FOREIGN KEY ("istruttori_id") REFERENCES "public"."istruttori"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "eventi" ADD CONSTRAINT "eventi_sede_id_sedi_id_fk" FOREIGN KEY ("sede_id") REFERENCES "public"."sedi"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "eventi" ADD CONSTRAINT "eventi_copertina_id_media_id_fk" FOREIGN KEY ("copertina_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "eventi_locales" ADD CONSTRAINT "eventi_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "eventi_locales" ADD CONSTRAINT "eventi_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."eventi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "eventi_rels" ADD CONSTRAINT "eventi_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."eventi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "eventi_rels" ADD CONSTRAINT "eventi_rels_corsi_fk" FOREIGN KEY ("corsi_id") REFERENCES "public"."corsi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_eventi_v" ADD CONSTRAINT "_eventi_v_parent_id_eventi_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."eventi"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_eventi_v" ADD CONSTRAINT "_eventi_v_version_sede_id_sedi_id_fk" FOREIGN KEY ("version_sede_id") REFERENCES "public"."sedi"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_eventi_v" ADD CONSTRAINT "_eventi_v_version_copertina_id_media_id_fk" FOREIGN KEY ("version_copertina_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_eventi_v_locales" ADD CONSTRAINT "_eventi_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_eventi_v_locales" ADD CONSTRAINT "_eventi_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_eventi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_eventi_v_rels" ADD CONSTRAINT "_eventi_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_eventi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_eventi_v_rels" ADD CONSTRAINT "_eventi_v_rels_corsi_fk" FOREIGN KEY ("corsi_id") REFERENCES "public"."corsi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "corsi_focus" ADD CONSTRAINT "corsi_focus_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."corsi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "corsi_risultati" ADD CONSTRAINT "corsi_risultati_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."corsi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "corsi_adatto_a" ADD CONSTRAINT "corsi_adatto_a_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."corsi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "corsi" ADD CONSTRAINT "corsi_immagine_id_media_id_fk" FOREIGN KEY ("immagine_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "corsi_locales" ADD CONSTRAINT "corsi_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "corsi_locales" ADD CONSTRAINT "corsi_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."corsi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_corsi_v_version_focus" ADD CONSTRAINT "_corsi_v_version_focus_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_corsi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_corsi_v_version_risultati" ADD CONSTRAINT "_corsi_v_version_risultati_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_corsi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_corsi_v_version_adatto_a" ADD CONSTRAINT "_corsi_v_version_adatto_a_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_corsi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_corsi_v" ADD CONSTRAINT "_corsi_v_parent_id_corsi_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."corsi"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_corsi_v" ADD CONSTRAINT "_corsi_v_version_immagine_id_media_id_fk" FOREIGN KEY ("version_immagine_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_corsi_v_locales" ADD CONSTRAINT "_corsi_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_corsi_v_locales" ADD CONSTRAINT "_corsi_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_corsi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sedi_orari_giorni" ADD CONSTRAINT "sedi_orari_giorni_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."sedi_orari"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sedi_orari" ADD CONSTRAINT "sedi_orari_disciplina_id_corsi_id_fk" FOREIGN KEY ("disciplina_id") REFERENCES "public"."corsi"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sedi_orari" ADD CONSTRAINT "sedi_orari_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sedi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sedi" ADD CONSTRAINT "sedi_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sedi_locales" ADD CONSTRAINT "sedi_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sedi_locales" ADD CONSTRAINT "sedi_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sedi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sedi_rels" ADD CONSTRAINT "sedi_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."sedi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sedi_rels" ADD CONSTRAINT "sedi_rels_istruttori_fk" FOREIGN KEY ("istruttori_id") REFERENCES "public"."istruttori"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_sedi_v_version_orari_giorni" ADD CONSTRAINT "_sedi_v_version_orari_giorni_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_sedi_v_version_orari"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_sedi_v_version_orari" ADD CONSTRAINT "_sedi_v_version_orari_disciplina_id_corsi_id_fk" FOREIGN KEY ("disciplina_id") REFERENCES "public"."corsi"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sedi_v_version_orari" ADD CONSTRAINT "_sedi_v_version_orari_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_sedi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_sedi_v" ADD CONSTRAINT "_sedi_v_parent_id_sedi_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."sedi"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sedi_v" ADD CONSTRAINT "_sedi_v_version_foto_id_media_id_fk" FOREIGN KEY ("version_foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sedi_v_locales" ADD CONSTRAINT "_sedi_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sedi_v_locales" ADD CONSTRAINT "_sedi_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_sedi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_sedi_v_rels" ADD CONSTRAINT "_sedi_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_sedi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_sedi_v_rels" ADD CONSTRAINT "_sedi_v_rels_istruttori_fk" FOREIGN KEY ("istruttori_id") REFERENCES "public"."istruttori"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "istruttori_credenziali" ADD CONSTRAINT "istruttori_credenziali_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."istruttori"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "istruttori_focus" ADD CONSTRAINT "istruttori_focus_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."istruttori"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "istruttori" ADD CONSTRAINT "istruttori_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "istruttori_locales" ADD CONSTRAINT "istruttori_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "istruttori_locales" ADD CONSTRAINT "istruttori_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."istruttori"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_istruttori_v_version_credenziali" ADD CONSTRAINT "_istruttori_v_version_credenziali_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_istruttori_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_istruttori_v_version_focus" ADD CONSTRAINT "_istruttori_v_version_focus_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_istruttori_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_istruttori_v" ADD CONSTRAINT "_istruttori_v_parent_id_istruttori_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."istruttori"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_istruttori_v" ADD CONSTRAINT "_istruttori_v_version_foto_id_media_id_fk" FOREIGN KEY ("version_foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_istruttori_v_locales" ADD CONSTRAINT "_istruttori_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_istruttori_v_locales" ADD CONSTRAINT "_istruttori_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_istruttori_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "richieste" ADD CONSTRAINT "richieste_sede_id_sedi_id_fk" FOREIGN KEY ("sede_id") REFERENCES "public"."sedi"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "richieste" ADD CONSTRAINT "richieste_corso_id_corsi_id_fk" FOREIGN KEY ("corso_id") REFERENCES "public"."corsi"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "utenti_sessions" ADD CONSTRAINT "utenti_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."utenti"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pagine_fk" FOREIGN KEY ("pagine_id") REFERENCES "public"."pagine"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_eventi_fk" FOREIGN KEY ("eventi_id") REFERENCES "public"."eventi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_corsi_fk" FOREIGN KEY ("corsi_id") REFERENCES "public"."corsi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_sedi_fk" FOREIGN KEY ("sedi_id") REFERENCES "public"."sedi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_istruttori_fk" FOREIGN KEY ("istruttori_id") REFERENCES "public"."istruttori"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pagine_fk" FOREIGN KEY ("pagine_id") REFERENCES "public"."pagine"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_eventi_fk" FOREIGN KEY ("eventi_id") REFERENCES "public"."eventi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_corsi_fk" FOREIGN KEY ("corsi_id") REFERENCES "public"."corsi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sedi_fk" FOREIGN KEY ("sedi_id") REFERENCES "public"."sedi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_istruttori_fk" FOREIGN KEY ("istruttori_id") REFERENCES "public"."istruttori"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_richieste_fk" FOREIGN KEY ("richieste_id") REFERENCES "public"."richieste"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_utenti_fk" FOREIGN KEY ("utenti_id") REFERENCES "public"."utenti"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_utenti_fk" FOREIGN KEY ("utenti_id") REFERENCES "public"."utenti"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contatti_social" ADD CONSTRAINT "contatti_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contatti"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contatti" ADD CONSTRAINT "contatti_immagine_contatti_id_media_id_fk" FOREIGN KEY ("immagine_contatti_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contatti_v_version_social" ADD CONSTRAINT "_contatti_v_version_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contatti_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contatti_v" ADD CONSTRAINT "_contatti_v_version_immagine_contatti_id_media_id_fk" FOREIGN KEY ("version_immagine_contatti_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "impostazioni" ADD CONSTRAINT "impostazioni_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "impostazioni" ADD CONSTRAINT "impostazioni_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "impostazioni" ADD CONSTRAINT "impostazioni_immagine_hero_id_media_id_fk" FOREIGN KEY ("immagine_hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_impostazioni_v" ADD CONSTRAINT "_impostazioni_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_impostazioni_v" ADD CONSTRAINT "_impostazioni_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_impostazioni_v" ADD CONSTRAINT "_impostazioni_v_version_immagine_hero_id_media_id_fk" FOREIGN KEY ("version_immagine_hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigazione_voci" ADD CONSTRAINT "navigazione_voci_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigazione"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigazione_v_version_voci" ADD CONSTRAINT "_navigazione_v_version_voci_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigazione_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pagine_sezioni_order_idx" ON "pagine_sezioni" USING btree ("_order");
  CREATE INDEX "pagine_sezioni_parent_id_idx" ON "pagine_sezioni" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pagine_slug_idx" ON "pagine" USING btree ("slug");
  CREATE INDEX "pagine_parent_idx" ON "pagine" USING btree ("parent_id");
  CREATE UNIQUE INDEX "pagine_path_idx" ON "pagine" USING btree ("path");
  CREATE INDEX "pagine_immagine_hero_idx" ON "pagine" USING btree ("immagine_hero_id");
  CREATE UNIQUE INDEX "pagine_legacy_legacy_wp_id_idx" ON "pagine" USING btree ("legacy_wp_id");
  CREATE INDEX "pagine_updated_at_idx" ON "pagine" USING btree ("updated_at");
  CREATE INDEX "pagine_created_at_idx" ON "pagine" USING btree ("created_at");
  CREATE INDEX "pagine__status_idx" ON "pagine" USING btree ("_status");
  CREATE INDEX "pagine_meta_meta_image_idx" ON "pagine_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pagine_locales_locale_parent_id_unique" ON "pagine_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pagine_v_version_sezioni_order_idx" ON "_pagine_v_version_sezioni" USING btree ("_order");
  CREATE INDEX "_pagine_v_version_sezioni_parent_id_idx" ON "_pagine_v_version_sezioni" USING btree ("_parent_id");
  CREATE INDEX "_pagine_v_parent_idx" ON "_pagine_v" USING btree ("parent_id");
  CREATE INDEX "_pagine_v_version_version_slug_idx" ON "_pagine_v" USING btree ("version_slug");
  CREATE INDEX "_pagine_v_version_version_parent_idx" ON "_pagine_v" USING btree ("version_parent_id");
  CREATE INDEX "_pagine_v_version_version_path_idx" ON "_pagine_v" USING btree ("version_path");
  CREATE INDEX "_pagine_v_version_version_immagine_hero_idx" ON "_pagine_v" USING btree ("version_immagine_hero_id");
  CREATE INDEX "_pagine_v_version_legacy_version_legacy_wp_id_idx" ON "_pagine_v" USING btree ("version_legacy_wp_id");
  CREATE INDEX "_pagine_v_version_version_updated_at_idx" ON "_pagine_v" USING btree ("version_updated_at");
  CREATE INDEX "_pagine_v_version_version_created_at_idx" ON "_pagine_v" USING btree ("version_created_at");
  CREATE INDEX "_pagine_v_version_version__status_idx" ON "_pagine_v" USING btree ("version__status");
  CREATE INDEX "_pagine_v_created_at_idx" ON "_pagine_v" USING btree ("created_at");
  CREATE INDEX "_pagine_v_updated_at_idx" ON "_pagine_v" USING btree ("updated_at");
  CREATE INDEX "_pagine_v_snapshot_idx" ON "_pagine_v" USING btree ("snapshot");
  CREATE INDEX "_pagine_v_published_locale_idx" ON "_pagine_v" USING btree ("published_locale");
  CREATE INDEX "_pagine_v_latest_idx" ON "_pagine_v" USING btree ("latest");
  CREATE INDEX "_pagine_v_version_meta_version_meta_image_idx" ON "_pagine_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pagine_v_locales_locale_parent_id_unique" ON "_pagine_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_data_idx" ON "news" USING btree ("data");
  CREATE INDEX "news_tipo_idx" ON "news" USING btree ("tipo");
  CREATE INDEX "news_copertina_idx" ON "news" USING btree ("copertina_id");
  CREATE UNIQUE INDEX "news_legacy_legacy_wp_id_idx" ON "news" USING btree ("legacy_wp_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE INDEX "news_meta_meta_image_idx" ON "news_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "news_locales_locale_parent_id_unique" ON "news_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "news_rels_order_idx" ON "news_rels" USING btree ("order");
  CREATE INDEX "news_rels_parent_idx" ON "news_rels" USING btree ("parent_id");
  CREATE INDEX "news_rels_path_idx" ON "news_rels" USING btree ("path");
  CREATE INDEX "news_rels_sedi_id_idx" ON "news_rels" USING btree ("sedi_id");
  CREATE INDEX "news_rels_istruttori_id_idx" ON "news_rels" USING btree ("istruttori_id");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_data_idx" ON "_news_v" USING btree ("version_data");
  CREATE INDEX "_news_v_version_version_tipo_idx" ON "_news_v" USING btree ("version_tipo");
  CREATE INDEX "_news_v_version_version_copertina_idx" ON "_news_v" USING btree ("version_copertina_id");
  CREATE INDEX "_news_v_version_legacy_version_legacy_wp_id_idx" ON "_news_v" USING btree ("version_legacy_wp_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_snapshot_idx" ON "_news_v" USING btree ("snapshot");
  CREATE INDEX "_news_v_published_locale_idx" ON "_news_v" USING btree ("published_locale");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE INDEX "_news_v_version_meta_version_meta_image_idx" ON "_news_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_news_v_locales_locale_parent_id_unique" ON "_news_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_news_v_rels_order_idx" ON "_news_v_rels" USING btree ("order");
  CREATE INDEX "_news_v_rels_parent_idx" ON "_news_v_rels" USING btree ("parent_id");
  CREATE INDEX "_news_v_rels_path_idx" ON "_news_v_rels" USING btree ("path");
  CREATE INDEX "_news_v_rels_sedi_id_idx" ON "_news_v_rels" USING btree ("sedi_id");
  CREATE INDEX "_news_v_rels_istruttori_id_idx" ON "_news_v_rels" USING btree ("istruttori_id");
  CREATE UNIQUE INDEX "eventi_slug_idx" ON "eventi" USING btree ("slug");
  CREATE INDEX "eventi_data_inizio_idx" ON "eventi" USING btree ("data_inizio");
  CREATE INDEX "eventi_sede_idx" ON "eventi" USING btree ("sede_id");
  CREATE INDEX "eventi_copertina_idx" ON "eventi" USING btree ("copertina_id");
  CREATE INDEX "eventi_updated_at_idx" ON "eventi" USING btree ("updated_at");
  CREATE INDEX "eventi_created_at_idx" ON "eventi" USING btree ("created_at");
  CREATE INDEX "eventi__status_idx" ON "eventi" USING btree ("_status");
  CREATE INDEX "eventi_meta_meta_image_idx" ON "eventi_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "eventi_locales_locale_parent_id_unique" ON "eventi_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "eventi_rels_order_idx" ON "eventi_rels" USING btree ("order");
  CREATE INDEX "eventi_rels_parent_idx" ON "eventi_rels" USING btree ("parent_id");
  CREATE INDEX "eventi_rels_path_idx" ON "eventi_rels" USING btree ("path");
  CREATE INDEX "eventi_rels_corsi_id_idx" ON "eventi_rels" USING btree ("corsi_id");
  CREATE INDEX "_eventi_v_parent_idx" ON "_eventi_v" USING btree ("parent_id");
  CREATE INDEX "_eventi_v_version_version_slug_idx" ON "_eventi_v" USING btree ("version_slug");
  CREATE INDEX "_eventi_v_version_version_data_inizio_idx" ON "_eventi_v" USING btree ("version_data_inizio");
  CREATE INDEX "_eventi_v_version_version_sede_idx" ON "_eventi_v" USING btree ("version_sede_id");
  CREATE INDEX "_eventi_v_version_version_copertina_idx" ON "_eventi_v" USING btree ("version_copertina_id");
  CREATE INDEX "_eventi_v_version_version_updated_at_idx" ON "_eventi_v" USING btree ("version_updated_at");
  CREATE INDEX "_eventi_v_version_version_created_at_idx" ON "_eventi_v" USING btree ("version_created_at");
  CREATE INDEX "_eventi_v_version_version__status_idx" ON "_eventi_v" USING btree ("version__status");
  CREATE INDEX "_eventi_v_created_at_idx" ON "_eventi_v" USING btree ("created_at");
  CREATE INDEX "_eventi_v_updated_at_idx" ON "_eventi_v" USING btree ("updated_at");
  CREATE INDEX "_eventi_v_snapshot_idx" ON "_eventi_v" USING btree ("snapshot");
  CREATE INDEX "_eventi_v_published_locale_idx" ON "_eventi_v" USING btree ("published_locale");
  CREATE INDEX "_eventi_v_latest_idx" ON "_eventi_v" USING btree ("latest");
  CREATE INDEX "_eventi_v_version_meta_version_meta_image_idx" ON "_eventi_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_eventi_v_locales_locale_parent_id_unique" ON "_eventi_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_eventi_v_rels_order_idx" ON "_eventi_v_rels" USING btree ("order");
  CREATE INDEX "_eventi_v_rels_parent_idx" ON "_eventi_v_rels" USING btree ("parent_id");
  CREATE INDEX "_eventi_v_rels_path_idx" ON "_eventi_v_rels" USING btree ("path");
  CREATE INDEX "_eventi_v_rels_corsi_id_idx" ON "_eventi_v_rels" USING btree ("corsi_id");
  CREATE INDEX "corsi_focus_order_idx" ON "corsi_focus" USING btree ("_order");
  CREATE INDEX "corsi_focus_parent_id_idx" ON "corsi_focus" USING btree ("_parent_id");
  CREATE INDEX "corsi_risultati_order_idx" ON "corsi_risultati" USING btree ("_order");
  CREATE INDEX "corsi_risultati_parent_id_idx" ON "corsi_risultati" USING btree ("_parent_id");
  CREATE INDEX "corsi_adatto_a_order_idx" ON "corsi_adatto_a" USING btree ("_order");
  CREATE INDEX "corsi_adatto_a_parent_id_idx" ON "corsi_adatto_a" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "corsi_slug_idx" ON "corsi" USING btree ("slug");
  CREATE INDEX "corsi_target_idx" ON "corsi" USING btree ("target");
  CREATE INDEX "corsi_immagine_idx" ON "corsi" USING btree ("immagine_id");
  CREATE INDEX "corsi_updated_at_idx" ON "corsi" USING btree ("updated_at");
  CREATE INDEX "corsi_created_at_idx" ON "corsi" USING btree ("created_at");
  CREATE INDEX "corsi__status_idx" ON "corsi" USING btree ("_status");
  CREATE INDEX "corsi_meta_meta_image_idx" ON "corsi_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "corsi_locales_locale_parent_id_unique" ON "corsi_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_corsi_v_version_focus_order_idx" ON "_corsi_v_version_focus" USING btree ("_order");
  CREATE INDEX "_corsi_v_version_focus_parent_id_idx" ON "_corsi_v_version_focus" USING btree ("_parent_id");
  CREATE INDEX "_corsi_v_version_risultati_order_idx" ON "_corsi_v_version_risultati" USING btree ("_order");
  CREATE INDEX "_corsi_v_version_risultati_parent_id_idx" ON "_corsi_v_version_risultati" USING btree ("_parent_id");
  CREATE INDEX "_corsi_v_version_adatto_a_order_idx" ON "_corsi_v_version_adatto_a" USING btree ("_order");
  CREATE INDEX "_corsi_v_version_adatto_a_parent_id_idx" ON "_corsi_v_version_adatto_a" USING btree ("_parent_id");
  CREATE INDEX "_corsi_v_parent_idx" ON "_corsi_v" USING btree ("parent_id");
  CREATE INDEX "_corsi_v_version_version_slug_idx" ON "_corsi_v" USING btree ("version_slug");
  CREATE INDEX "_corsi_v_version_version_target_idx" ON "_corsi_v" USING btree ("version_target");
  CREATE INDEX "_corsi_v_version_version_immagine_idx" ON "_corsi_v" USING btree ("version_immagine_id");
  CREATE INDEX "_corsi_v_version_version_updated_at_idx" ON "_corsi_v" USING btree ("version_updated_at");
  CREATE INDEX "_corsi_v_version_version_created_at_idx" ON "_corsi_v" USING btree ("version_created_at");
  CREATE INDEX "_corsi_v_version_version__status_idx" ON "_corsi_v" USING btree ("version__status");
  CREATE INDEX "_corsi_v_created_at_idx" ON "_corsi_v" USING btree ("created_at");
  CREATE INDEX "_corsi_v_updated_at_idx" ON "_corsi_v" USING btree ("updated_at");
  CREATE INDEX "_corsi_v_snapshot_idx" ON "_corsi_v" USING btree ("snapshot");
  CREATE INDEX "_corsi_v_published_locale_idx" ON "_corsi_v" USING btree ("published_locale");
  CREATE INDEX "_corsi_v_latest_idx" ON "_corsi_v" USING btree ("latest");
  CREATE INDEX "_corsi_v_version_meta_version_meta_image_idx" ON "_corsi_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_corsi_v_locales_locale_parent_id_unique" ON "_corsi_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "sedi_orari_giorni_order_idx" ON "sedi_orari_giorni" USING btree ("order");
  CREATE INDEX "sedi_orari_giorni_parent_idx" ON "sedi_orari_giorni" USING btree ("parent_id");
  CREATE INDEX "sedi_orari_order_idx" ON "sedi_orari" USING btree ("_order");
  CREATE INDEX "sedi_orari_parent_id_idx" ON "sedi_orari" USING btree ("_parent_id");
  CREATE INDEX "sedi_orari_disciplina_idx" ON "sedi_orari" USING btree ("disciplina_id");
  CREATE UNIQUE INDEX "sedi_slug_idx" ON "sedi" USING btree ("slug");
  CREATE INDEX "sedi_indirizzo_indirizzo_provincia_idx" ON "sedi" USING btree ("indirizzo_provincia");
  CREATE INDEX "sedi_indirizzo_indirizzo_nazione_idx" ON "sedi" USING btree ("indirizzo_nazione");
  CREATE INDEX "sedi_attivo_idx" ON "sedi" USING btree ("attivo");
  CREATE INDEX "sedi_foto_idx" ON "sedi" USING btree ("foto_id");
  CREATE UNIQUE INDEX "sedi_legacy_legacy_wp_id_idx" ON "sedi" USING btree ("legacy_wp_id");
  CREATE INDEX "sedi_updated_at_idx" ON "sedi" USING btree ("updated_at");
  CREATE INDEX "sedi_created_at_idx" ON "sedi" USING btree ("created_at");
  CREATE INDEX "sedi__status_idx" ON "sedi" USING btree ("_status");
  CREATE INDEX "sedi_meta_meta_image_idx" ON "sedi_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "sedi_locales_locale_parent_id_unique" ON "sedi_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "sedi_rels_order_idx" ON "sedi_rels" USING btree ("order");
  CREATE INDEX "sedi_rels_parent_idx" ON "sedi_rels" USING btree ("parent_id");
  CREATE INDEX "sedi_rels_path_idx" ON "sedi_rels" USING btree ("path");
  CREATE INDEX "sedi_rels_istruttori_id_idx" ON "sedi_rels" USING btree ("istruttori_id");
  CREATE INDEX "_sedi_v_version_orari_giorni_order_idx" ON "_sedi_v_version_orari_giorni" USING btree ("order");
  CREATE INDEX "_sedi_v_version_orari_giorni_parent_idx" ON "_sedi_v_version_orari_giorni" USING btree ("parent_id");
  CREATE INDEX "_sedi_v_version_orari_order_idx" ON "_sedi_v_version_orari" USING btree ("_order");
  CREATE INDEX "_sedi_v_version_orari_parent_id_idx" ON "_sedi_v_version_orari" USING btree ("_parent_id");
  CREATE INDEX "_sedi_v_version_orari_disciplina_idx" ON "_sedi_v_version_orari" USING btree ("disciplina_id");
  CREATE INDEX "_sedi_v_parent_idx" ON "_sedi_v" USING btree ("parent_id");
  CREATE INDEX "_sedi_v_version_version_slug_idx" ON "_sedi_v" USING btree ("version_slug");
  CREATE INDEX "_sedi_v_version_indirizzo_version_indirizzo_provincia_idx" ON "_sedi_v" USING btree ("version_indirizzo_provincia");
  CREATE INDEX "_sedi_v_version_indirizzo_version_indirizzo_nazione_idx" ON "_sedi_v" USING btree ("version_indirizzo_nazione");
  CREATE INDEX "_sedi_v_version_version_attivo_idx" ON "_sedi_v" USING btree ("version_attivo");
  CREATE INDEX "_sedi_v_version_version_foto_idx" ON "_sedi_v" USING btree ("version_foto_id");
  CREATE INDEX "_sedi_v_version_legacy_version_legacy_wp_id_idx" ON "_sedi_v" USING btree ("version_legacy_wp_id");
  CREATE INDEX "_sedi_v_version_version_updated_at_idx" ON "_sedi_v" USING btree ("version_updated_at");
  CREATE INDEX "_sedi_v_version_version_created_at_idx" ON "_sedi_v" USING btree ("version_created_at");
  CREATE INDEX "_sedi_v_version_version__status_idx" ON "_sedi_v" USING btree ("version__status");
  CREATE INDEX "_sedi_v_created_at_idx" ON "_sedi_v" USING btree ("created_at");
  CREATE INDEX "_sedi_v_updated_at_idx" ON "_sedi_v" USING btree ("updated_at");
  CREATE INDEX "_sedi_v_snapshot_idx" ON "_sedi_v" USING btree ("snapshot");
  CREATE INDEX "_sedi_v_published_locale_idx" ON "_sedi_v" USING btree ("published_locale");
  CREATE INDEX "_sedi_v_latest_idx" ON "_sedi_v" USING btree ("latest");
  CREATE INDEX "_sedi_v_version_meta_version_meta_image_idx" ON "_sedi_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_sedi_v_locales_locale_parent_id_unique" ON "_sedi_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_sedi_v_rels_order_idx" ON "_sedi_v_rels" USING btree ("order");
  CREATE INDEX "_sedi_v_rels_parent_idx" ON "_sedi_v_rels" USING btree ("parent_id");
  CREATE INDEX "_sedi_v_rels_path_idx" ON "_sedi_v_rels" USING btree ("path");
  CREATE INDEX "_sedi_v_rels_istruttori_id_idx" ON "_sedi_v_rels" USING btree ("istruttori_id");
  CREATE INDEX "istruttori_credenziali_order_idx" ON "istruttori_credenziali" USING btree ("_order");
  CREATE INDEX "istruttori_credenziali_parent_id_idx" ON "istruttori_credenziali" USING btree ("_parent_id");
  CREATE INDEX "istruttori_focus_order_idx" ON "istruttori_focus" USING btree ("_order");
  CREATE INDEX "istruttori_focus_parent_id_idx" ON "istruttori_focus" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "istruttori_slug_idx" ON "istruttori" USING btree ("slug");
  CREATE INDEX "istruttori_qualifica_idx" ON "istruttori" USING btree ("qualifica");
  CREATE INDEX "istruttori_foto_idx" ON "istruttori" USING btree ("foto_id");
  CREATE INDEX "istruttori_updated_at_idx" ON "istruttori" USING btree ("updated_at");
  CREATE INDEX "istruttori_created_at_idx" ON "istruttori" USING btree ("created_at");
  CREATE INDEX "istruttori__status_idx" ON "istruttori" USING btree ("_status");
  CREATE INDEX "istruttori_meta_meta_image_idx" ON "istruttori_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "istruttori_locales_locale_parent_id_unique" ON "istruttori_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_istruttori_v_version_credenziali_order_idx" ON "_istruttori_v_version_credenziali" USING btree ("_order");
  CREATE INDEX "_istruttori_v_version_credenziali_parent_id_idx" ON "_istruttori_v_version_credenziali" USING btree ("_parent_id");
  CREATE INDEX "_istruttori_v_version_focus_order_idx" ON "_istruttori_v_version_focus" USING btree ("_order");
  CREATE INDEX "_istruttori_v_version_focus_parent_id_idx" ON "_istruttori_v_version_focus" USING btree ("_parent_id");
  CREATE INDEX "_istruttori_v_parent_idx" ON "_istruttori_v" USING btree ("parent_id");
  CREATE INDEX "_istruttori_v_version_version_slug_idx" ON "_istruttori_v" USING btree ("version_slug");
  CREATE INDEX "_istruttori_v_version_version_qualifica_idx" ON "_istruttori_v" USING btree ("version_qualifica");
  CREATE INDEX "_istruttori_v_version_version_foto_idx" ON "_istruttori_v" USING btree ("version_foto_id");
  CREATE INDEX "_istruttori_v_version_version_updated_at_idx" ON "_istruttori_v" USING btree ("version_updated_at");
  CREATE INDEX "_istruttori_v_version_version_created_at_idx" ON "_istruttori_v" USING btree ("version_created_at");
  CREATE INDEX "_istruttori_v_version_version__status_idx" ON "_istruttori_v" USING btree ("version__status");
  CREATE INDEX "_istruttori_v_created_at_idx" ON "_istruttori_v" USING btree ("created_at");
  CREATE INDEX "_istruttori_v_updated_at_idx" ON "_istruttori_v" USING btree ("updated_at");
  CREATE INDEX "_istruttori_v_snapshot_idx" ON "_istruttori_v" USING btree ("snapshot");
  CREATE INDEX "_istruttori_v_published_locale_idx" ON "_istruttori_v" USING btree ("published_locale");
  CREATE INDEX "_istruttori_v_latest_idx" ON "_istruttori_v" USING btree ("latest");
  CREATE INDEX "_istruttori_v_version_meta_version_meta_image_idx" ON "_istruttori_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_istruttori_v_locales_locale_parent_id_unique" ON "_istruttori_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "richieste_stato_idx" ON "richieste" USING btree ("stato");
  CREATE INDEX "richieste_sede_idx" ON "richieste" USING btree ("sede_id");
  CREATE INDEX "richieste_corso_idx" ON "richieste" USING btree ("corso_id");
  CREATE INDEX "richieste_updated_at_idx" ON "richieste" USING btree ("updated_at");
  CREATE INDEX "richieste_created_at_idx" ON "richieste" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_legacy_legacy_wp_id_idx" ON "media" USING btree ("legacy_wp_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "utenti_sessions_order_idx" ON "utenti_sessions" USING btree ("_order");
  CREATE INDEX "utenti_sessions_parent_id_idx" ON "utenti_sessions" USING btree ("_parent_id");
  CREATE INDEX "utenti_updated_at_idx" ON "utenti" USING btree ("updated_at");
  CREATE INDEX "utenti_created_at_idx" ON "utenti" USING btree ("created_at");
  CREATE UNIQUE INDEX "utenti_email_idx" ON "utenti" USING btree ("email");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_pagine_id_idx" ON "redirects_rels" USING btree ("pagine_id");
  CREATE INDEX "redirects_rels_news_id_idx" ON "redirects_rels" USING btree ("news_id");
  CREATE INDEX "redirects_rels_eventi_id_idx" ON "redirects_rels" USING btree ("eventi_id");
  CREATE INDEX "redirects_rels_corsi_id_idx" ON "redirects_rels" USING btree ("corsi_id");
  CREATE INDEX "redirects_rels_sedi_id_idx" ON "redirects_rels" USING btree ("sedi_id");
  CREATE INDEX "redirects_rels_istruttori_id_idx" ON "redirects_rels" USING btree ("istruttori_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pagine_id_idx" ON "payload_locked_documents_rels" USING btree ("pagine_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_eventi_id_idx" ON "payload_locked_documents_rels" USING btree ("eventi_id");
  CREATE INDEX "payload_locked_documents_rels_corsi_id_idx" ON "payload_locked_documents_rels" USING btree ("corsi_id");
  CREATE INDEX "payload_locked_documents_rels_sedi_id_idx" ON "payload_locked_documents_rels" USING btree ("sedi_id");
  CREATE INDEX "payload_locked_documents_rels_istruttori_id_idx" ON "payload_locked_documents_rels" USING btree ("istruttori_id");
  CREATE INDEX "payload_locked_documents_rels_richieste_id_idx" ON "payload_locked_documents_rels" USING btree ("richieste_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_utenti_id_idx" ON "payload_locked_documents_rels" USING btree ("utenti_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_utenti_id_idx" ON "payload_preferences_rels" USING btree ("utenti_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "contatti_social_order_idx" ON "contatti_social" USING btree ("_order");
  CREATE INDEX "contatti_social_parent_id_idx" ON "contatti_social" USING btree ("_parent_id");
  CREATE INDEX "contatti_immagine_contatti_idx" ON "contatti" USING btree ("immagine_contatti_id");
  CREATE INDEX "_contatti_v_version_social_order_idx" ON "_contatti_v_version_social" USING btree ("_order");
  CREATE INDEX "_contatti_v_version_social_parent_id_idx" ON "_contatti_v_version_social" USING btree ("_parent_id");
  CREATE INDEX "_contatti_v_version_version_immagine_contatti_idx" ON "_contatti_v" USING btree ("version_immagine_contatti_id");
  CREATE INDEX "_contatti_v_created_at_idx" ON "_contatti_v" USING btree ("created_at");
  CREATE INDEX "_contatti_v_updated_at_idx" ON "_contatti_v" USING btree ("updated_at");
  CREATE INDEX "impostazioni_logo_idx" ON "impostazioni" USING btree ("logo_id");
  CREATE INDEX "impostazioni_og_image_idx" ON "impostazioni" USING btree ("og_image_id");
  CREATE INDEX "impostazioni_immagine_hero_idx" ON "impostazioni" USING btree ("immagine_hero_id");
  CREATE INDEX "_impostazioni_v_version_version_logo_idx" ON "_impostazioni_v" USING btree ("version_logo_id");
  CREATE INDEX "_impostazioni_v_version_version_og_image_idx" ON "_impostazioni_v" USING btree ("version_og_image_id");
  CREATE INDEX "_impostazioni_v_version_version_immagine_hero_idx" ON "_impostazioni_v" USING btree ("version_immagine_hero_id");
  CREATE INDEX "_impostazioni_v_created_at_idx" ON "_impostazioni_v" USING btree ("created_at");
  CREATE INDEX "_impostazioni_v_updated_at_idx" ON "_impostazioni_v" USING btree ("updated_at");
  CREATE INDEX "navigazione_voci_order_idx" ON "navigazione_voci" USING btree ("_order");
  CREATE INDEX "navigazione_voci_parent_id_idx" ON "navigazione_voci" USING btree ("_parent_id");
  CREATE INDEX "_navigazione_v_version_voci_order_idx" ON "_navigazione_v_version_voci" USING btree ("_order");
  CREATE INDEX "_navigazione_v_version_voci_parent_id_idx" ON "_navigazione_v_version_voci" USING btree ("_parent_id");
  CREATE INDEX "_navigazione_v_created_at_idx" ON "_navigazione_v" USING btree ("created_at");
  CREATE INDEX "_navigazione_v_updated_at_idx" ON "_navigazione_v" USING btree ("updated_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pagine_sezioni" CASCADE;
  DROP TABLE "pagine" CASCADE;
  DROP TABLE "pagine_locales" CASCADE;
  DROP TABLE "_pagine_v_version_sezioni" CASCADE;
  DROP TABLE "_pagine_v" CASCADE;
  DROP TABLE "_pagine_v_locales" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "news_locales" CASCADE;
  DROP TABLE "news_rels" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "_news_v_locales" CASCADE;
  DROP TABLE "_news_v_rels" CASCADE;
  DROP TABLE "eventi" CASCADE;
  DROP TABLE "eventi_locales" CASCADE;
  DROP TABLE "eventi_rels" CASCADE;
  DROP TABLE "_eventi_v" CASCADE;
  DROP TABLE "_eventi_v_locales" CASCADE;
  DROP TABLE "_eventi_v_rels" CASCADE;
  DROP TABLE "corsi_focus" CASCADE;
  DROP TABLE "corsi_risultati" CASCADE;
  DROP TABLE "corsi_adatto_a" CASCADE;
  DROP TABLE "corsi" CASCADE;
  DROP TABLE "corsi_locales" CASCADE;
  DROP TABLE "_corsi_v_version_focus" CASCADE;
  DROP TABLE "_corsi_v_version_risultati" CASCADE;
  DROP TABLE "_corsi_v_version_adatto_a" CASCADE;
  DROP TABLE "_corsi_v" CASCADE;
  DROP TABLE "_corsi_v_locales" CASCADE;
  DROP TABLE "sedi_orari_giorni" CASCADE;
  DROP TABLE "sedi_orari" CASCADE;
  DROP TABLE "sedi" CASCADE;
  DROP TABLE "sedi_locales" CASCADE;
  DROP TABLE "sedi_rels" CASCADE;
  DROP TABLE "_sedi_v_version_orari_giorni" CASCADE;
  DROP TABLE "_sedi_v_version_orari" CASCADE;
  DROP TABLE "_sedi_v" CASCADE;
  DROP TABLE "_sedi_v_locales" CASCADE;
  DROP TABLE "_sedi_v_rels" CASCADE;
  DROP TABLE "istruttori_credenziali" CASCADE;
  DROP TABLE "istruttori_focus" CASCADE;
  DROP TABLE "istruttori" CASCADE;
  DROP TABLE "istruttori_locales" CASCADE;
  DROP TABLE "_istruttori_v_version_credenziali" CASCADE;
  DROP TABLE "_istruttori_v_version_focus" CASCADE;
  DROP TABLE "_istruttori_v" CASCADE;
  DROP TABLE "_istruttori_v_locales" CASCADE;
  DROP TABLE "richieste" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "utenti_sessions" CASCADE;
  DROP TABLE "utenti" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "contatti_social" CASCADE;
  DROP TABLE "contatti" CASCADE;
  DROP TABLE "_contatti_v_version_social" CASCADE;
  DROP TABLE "_contatti_v" CASCADE;
  DROP TABLE "impostazioni" CASCADE;
  DROP TABLE "_impostazioni_v" CASCADE;
  DROP TABLE "navigazione_voci" CASCADE;
  DROP TABLE "navigazione" CASCADE;
  DROP TABLE "_navigazione_v_version_voci" CASCADE;
  DROP TABLE "_navigazione_v" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_pagine_status";
  DROP TYPE "public"."enum__pagine_v_version_status";
  DROP TYPE "public"."enum__pagine_v_published_locale";
  DROP TYPE "public"."enum_news_tipo";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_tipo";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum__news_v_published_locale";
  DROP TYPE "public"."enum_eventi_status";
  DROP TYPE "public"."enum__eventi_v_version_status";
  DROP TYPE "public"."enum__eventi_v_published_locale";
  DROP TYPE "public"."enum_corsi_target";
  DROP TYPE "public"."enum_corsi_superficie";
  DROP TYPE "public"."enum_corsi_status";
  DROP TYPE "public"."enum__corsi_v_version_target";
  DROP TYPE "public"."enum__corsi_v_version_superficie";
  DROP TYPE "public"."enum__corsi_v_version_status";
  DROP TYPE "public"."enum__corsi_v_published_locale";
  DROP TYPE "public"."enum_sedi_orari_giorni";
  DROP TYPE "public"."enum_sedi_indirizzo_nazione";
  DROP TYPE "public"."enum_sedi_status";
  DROP TYPE "public"."enum__sedi_v_version_orari_giorni";
  DROP TYPE "public"."enum__sedi_v_version_indirizzo_nazione";
  DROP TYPE "public"."enum__sedi_v_version_status";
  DROP TYPE "public"."enum__sedi_v_published_locale";
  DROP TYPE "public"."enum_istruttori_qualifica";
  DROP TYPE "public"."enum_istruttori_status";
  DROP TYPE "public"."enum__istruttori_v_version_qualifica";
  DROP TYPE "public"."enum__istruttori_v_version_status";
  DROP TYPE "public"."enum__istruttori_v_published_locale";
  DROP TYPE "public"."enum_richieste_stato";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_contatti_social_rete";
  DROP TYPE "public"."enum__contatti_v_version_social_rete";`)
}
