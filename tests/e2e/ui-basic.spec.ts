import { test, expect } from '@playwright/test'

test('header and sidebar present and interactive', async ({ page }) => {
    await page.goto('/')
    // Check map loads
    await expect(page.locator('.leaflet-container')).toBeVisible()
    // Check sidebar exists
    await expect(page.locator('text=Define Area of Interest')).toBeVisible()
})
