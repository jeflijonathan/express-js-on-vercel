# Laporan Bongkar Muat API

Base URL: `/api/laporan-bongkar-muat`

## Endpoints

### 1. Get All Laporan
- **URL**: `/laporan-bongkar-muat`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Query Params**: `page`, `limit`, `search`

### 2. Get Laporan by ID
- **URL**: `/laporan-bongkar-muat/:id`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)

### 3. Create Laporan
- **URL**: `/laporan-bongkar-muat`
- **Method**: `POST`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Payload**: Report data.

### 4. Update Laporan
- **URL**: `/laporan-bongkar-muat/:id`
- **Method**: `PUT`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Payload**: Updated report data.

### 5. Delete Laporan
- **URL**: `/laporan-bongkar-muat/:id`
- **Method**: `DELETE`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
