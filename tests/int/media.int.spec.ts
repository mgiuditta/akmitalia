// @vitest-environment node
// Sotto jsdom un Buffer non e' un Uint8Array dello stesso reame, e Payload non
// riesce a leggere il tipo del file: il caricamento fallirebbe per un altro motivo.
import type { Payload } from 'payload'
import config from '@/payload.config'
import { getPayload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import { MB_MASSIMI_VIDEO } from '@/collections/Media'

let payload: Payload

/* Il tetto del video dell'eroe (docs/adr/0015): il file si ferma prima di
   finire su disco, con una frase che dice come riesportarlo. */
describe('media', () => {
  beforeAll(async () => {
    payload = await getPayload({ config })
  })

  it('rifiuta un video sopra il tetto', async () => {
    const size = (MB_MASSIMI_VIDEO + 1) * 1024 * 1024
    // Payload riconosce il tipo dai primi byte: senza un box `ftyp` il file
    // verrebbe rifiutato come non-MP4 e il tetto non si vedrebbe mai.
    const data = Buffer.alloc(size)
    Buffer.from('000000186674797069736f6d0000020069736f6d6d703431', 'hex').copy(data)

    await expect(
      payload.create({
        collection: 'media',
        data: { alt: 'Spot troppo pesante' },
        file: { data, mimetype: 'video/mp4', name: 'spot.mp4', size },
      }),
    ).rejects.toThrow(`il massimo e' ${MB_MASSIMI_VIDEO}`)
  })
})
