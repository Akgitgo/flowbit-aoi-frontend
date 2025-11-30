import { test, expect } from '@playwright/test'

test('homepage loads and map container exists', async ({ page }) => {
    await page.goto('/')
    // map container is rendered
    const map = page.locator('.leaflet-container')
    await expect(map).toBeVisible()
})
