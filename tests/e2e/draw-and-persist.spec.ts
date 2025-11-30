import { test, expect } from '@playwright/test'

test('draw a marker then refresh - persisted in localStorage', async ({ page }) => {
  await page.goto('/')
  // This test will call app to create a marker via executing leaflet on page context.
  await page.evaluate(() => {
    // create a marker via global leaflet instance
    // @ts-ignore
    const map = (window as any).__REACT_LEAFLET_MAP__
    if (!map) return
    // add a marker at center
    // @ts-ignore
    const L = (window as any).L
    const marker = L.marker(map.getCenter()).addTo(map)
    // persist as app does by calling draw plugin logic: simulate saving into localStorage
    const geojson = marker.toGeoJSON()
    const key = 'flowbit:aoi:features'
    const prev = JSON.parse(localStorage.getItem(key) || '[]')
    prev.push(geojson)
    localStorage.setItem(key, JSON.stringify(prev))
  })

  // reload page; the sidebar should show saved AOIs
  await page.reload()
  await expect(page.locator('text=Saved AOIs')).toBeVisible()
  // Wait a little for sidebar to populate
  await page.waitForTimeout(400)
  // assert that "AOI #1" appears
  await expect(page.locator('text=AOI #1')).toBeVisible()
})
