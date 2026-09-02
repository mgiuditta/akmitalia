import * as migration_20260902_125844_iniziale from './20260902_125844_iniziale';
import * as migration_20260902_131708_moduli_e_navigazione from './20260902_131708_moduli_e_navigazione';
import * as migration_20260902_142340_slot_immagine from './20260902_142340_slot_immagine';
import * as migration_20260902_180253_bivio_passo_altre_voci from './20260902_180253_bivio_passo_altre_voci';

export const migrations = [
  {
    up: migration_20260902_125844_iniziale.up,
    down: migration_20260902_125844_iniziale.down,
    name: '20260902_125844_iniziale',
  },
  {
    up: migration_20260902_131708_moduli_e_navigazione.up,
    down: migration_20260902_131708_moduli_e_navigazione.down,
    name: '20260902_131708_moduli_e_navigazione',
  },
  {
    up: migration_20260902_142340_slot_immagine.up,
    down: migration_20260902_142340_slot_immagine.down,
    name: '20260902_142340_slot_immagine',
  },
  {
    up: migration_20260902_180253_bivio_passo_altre_voci.up,
    down: migration_20260902_180253_bivio_passo_altre_voci.down,
    name: '20260902_180253_bivio_passo_altre_voci'
  },
];
