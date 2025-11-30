import { test, expect } from '@playwright/test'

test('header and sidebar present and interactive', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=Flowbit AOI Creator')).toBeVisible()
    await expect(page.locator('input[type="checkbox"]')).toBeVisible()
})
