import type { Payload } from 'payload'
import config from '@/payload.config'
import { getPayload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

let payload: Payload

describe('schema', () => {
  beforeAll(async () => {
    payload = await getPayload({ config })
  })

  // L'unico pezzo di logica non banale dello schema: il path di una pagina figlia.
  it('calcola il path dalla catena dei genitori', async () => {
    const parentItem = await payload.create({
      collection: 'pagine',
      data: { titolo: 'Krav Maga', slug: 'krav-maga' },
    })
    const child = await payload.create({
      collection: 'pagine',
      data: { titolo: 'FAQ', slug: 'faq', parent: parentItem.id },
    })

    expect(parentItem.path).toBe('/krav-maga')
    expect(child.path).toBe('/krav-maga/faq')

    const found = await payload.find({
      collection: 'pagine',
      where: { path: { equals: '/krav-maga/faq' } },
    })
    expect(found.docs).toHaveLength(1)

    await payload.delete({ collection: 'pagine', id: child.id })
    await payload.delete({ collection: 'pagine', id: parentItem.id })
  })
})
