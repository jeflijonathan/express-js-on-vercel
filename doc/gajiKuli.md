# Gaji Kuli API

Base URL: `/api/gaji-kuli`

## Endpoints

### 1. Get All Gaji Kuli
- **URL**: `/gaji-kuli`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Query Params**: `page`, `limit`

### 2. Get Gaji Kuli by ID
- **URL**: `/gaji-kuli/:id`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)

### 3. Create Gaji Kuli
- **URL**: `/gaji-kuli`
- **Method**: `POST`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Payload**: Gaji data.

### 4. Update Gaji Kuli
- **URL**: `/gaji-kuli/:id`
- **Method**: `PUT`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Payload**: Updated gaji data.

### 5. Delete Gaji Kuli
- **URL**: `/gaji-kuli/:id`
- **Method**: `DELETE`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)

### 6. Batch Save Gaji Kuli
- **URL**: `/gaji-kuli/batch`
- **Method**: `POST`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Payload**: Array of gaji kuli objects.
