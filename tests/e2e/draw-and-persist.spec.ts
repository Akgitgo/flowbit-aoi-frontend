import { test, expect } from '@playwright/test'

test('localStorage persistence works', async ({ page }) => {
    await page.goto('/')

    // Wait for map to load
    await page.waitForSelector('.leaflet-container')

    // Set a test value in localStorage
    await page.evaluate(() => {
        const testData = [{ type: 'Feature', geometry: { type: 'Point', coordinates: [10, 51] } }]
        localStorage.setItem('flowbit:aoi:features', JSON.stringify(testData))
    })

    // Reload page
    await page.reload()

    // Check localStorage persisted
    const persisted = await page.evaluate(() => {
        const data = localStorage.getItem('flowbit:aoi:features')
        return data !== null && data.length > 0
    })

    expect(persisted).toBe(true)
})
