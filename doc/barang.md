# Master Barang API

Base URL: `/api/barang`

## Endpoints

### 1. Get All Barang
- **URL**: `/barang`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Query Params**: `page`, `limit`, `search`

### 2. Get Barang by ID
- **URL**: `/barang/:id`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)

### 3. Create Barang
- **URL**: `/barang`
- **Method**: `POST`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Payload**:
  ```json
  {
    "name": "Barang Name",
    "code": "CODE123"
  }
  ```

### 4. Update Barang
- **URL**: `/barang/:id`
- **Method**: `PUT`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Payload**: Updated barang fields.

### 5. Toggle Status Barang
- **URL**: `/barang/:id/status`
- **Method**: `PATCH`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Response**: Message confirming status change.
