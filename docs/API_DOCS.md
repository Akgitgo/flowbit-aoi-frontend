# API Documentation (Future Backend Plan)

Although the assignment requires client-only storage, here is the recommended API design.

## GET /api/aoi
Returns a list of all AOIs.

```json
{
  "features": [ { "id": "uuid", "geometry": {...}, "properties": {...} } ]
}
```

## POST /api/aoi
Create a new AOI.

**Request:**
```json
{ "feature": { ... }, "name": "AOI #1" }
```

## PUT /api/aoi/:id
Update existing AOI.

## DELETE /api/aoi/:id
Remove AOI.
