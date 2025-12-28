# Tarif Bongkar Muat API

Base URL: `/api/tarif-bongkar`

## Endpoints

### 1. Get All Tarif
- **URL**: `/tarif-bongkar`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Query Params**: `page`, `limit`

### 2. Get Tarif by ID
- **URL**: `/tarif-bongkar/:id`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)

### 3. Create Tarif
- **URL**: `/tarif-bongkar`
- **Method**: `POST`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Payload**: New tarif data.

### 4. Update Tarif
- **URL**: `/tarif-bongkar/:id`
- **Method**: `PUT`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Payload**: Updated tarif data.

### 5. Delete Tarif
- **URL**: `/tarif-bongkar/:id`
- **Method**: `DELETE`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)

### 6. Batch Save Tarif
- **URL**: `/tarif-bongkar/batch`
- **Method**: `POST`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Payload**: Array of tarif objects.
