import { test, expect } from '@playwright/test'

test('homepage loads and map container exists', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=Flowbit AOI Creator')).toBeVisible()
    // map container is rendered
    const map = page.locator('.leaflet-container')
    await expect(map).toBeVisible()
})
