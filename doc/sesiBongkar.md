# Sesi Bongkar Muat API

Base URL: `/api/bongkar-muat`

## Endpoints

### 1. Get All Sesi Bongkar Muat
- **URL**: `/bongkar-muat`
- **Method**: `GET`
- **Query Params**: `page`, `limit`, `search`, `status`, `startDate`, `endDate`
- **Headers**: Requires valid `accessToken` (Role: ADMIN, MANAJER, SPV)

### 2. Get Sesi Bongkar Muat by ID
- **URL**: `/bongkar-muat/:id`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken` (Role: ADMIN, MANAJER, SPV)

### 3. Create Import Sesi Bongkar Muat
- **URL**: `/bongkar-muat/import`
- **Method**: `POST`
- **Headers**: Requires valid `accessToken` (Role: ADMIN, MANAJER, SPV)
- **Payload**: (Expected fields for Import)

### 4. Create Export Sesi Bongkar Muat
- **URL**: `/bongkar-muat/export`
- **Method**: `POST`
- **Headers**: Requires valid `accessToken` (Role: ADMIN, MANAJER, SPV)
- **Payload**: (Expected fields for Export)

### 5. Update Sesi Bongkar Muat
- **URL**: `/bongkar-muat/:id`
- **Method**: `PUT`
- **Headers**: Requires valid `accessToken` (Role: MANAJER, SPV)
- **Payload**: Updated session data.
- **Note**: ADMIN is not allowed to update.

### 6. Delete Sesi Bongkar Muat
- **URL**: `/bongkar-muat/:noContainer`
- **Method**: `DELETE`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
