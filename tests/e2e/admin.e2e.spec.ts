import { test, expect, Page } from '@playwright/test'
import { login } from '../helpers/login'
import { seedTestUser, cleanupTestUser, testUser } from '../helpers/seedUser'

/* La collection degli utenti si chiama `utenti` e l'admin e' in italiano: il
   test del template cercava /collections/users e un `h1` che dice «Users», e
   falliva da quando il progetto esiste. */
test.describe('Admin Panel', () => {
  let page: Page

  test.beforeAll(async ({ browser }, testInfo) => {
    await seedTestUser()

    const context = await browser.newContext()
    page = await context.newPage()

    await login({ page, user: testUser })
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('can navigate to dashboard', async () => {
    await page.goto('http://localhost:3000/admin')
    await expect(page).toHaveURL('http://localhost:3000/admin')
    const dashboardArtifact = page.locator('span[title="Dashboard"]').first()
    await expect(dashboardArtifact).toBeVisible()
  })

  test('can navigate to list view', async () => {
    await page.goto('http://localhost:3000/admin/collections/utenti')
    await expect(page).toHaveURL('http://localhost:3000/admin/collections/utenti')
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('can navigate to edit view', async () => {
    await page.goto('http://localhost:3000/admin/collections/utenti/create')
    await expect(page).toHaveURL(/\/admin\/collections\/utenti\/[a-zA-Z0-9-_]+/)
    await expect(page.locator('#field-email')).toBeVisible()
  })
})
