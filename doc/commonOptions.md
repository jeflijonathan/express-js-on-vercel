# Common Options API (Master Data)

Base URL: `/api/options` (Assuming prefix from controller setup)

These endpoints are used to fetch master data options for dropdowns and filters.

## Endpoints

### 1. Get Role Options
- **URL**: `/role`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)

### 2. Get Transport Method Options
- **URL**: `/transport-method`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken`

### 3. Get Category Item Options
- **URL**: `/category-item`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken`

### 4. Get Employee Options
- **URL**: `/employee`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken`

### 5. Get Group Team Options
- **URL**: `/group-tim`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken`

### 6. Get Trade Type Options
- **URL**: `/trade-type`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken`

### 7. Get Container Size Options
- **URL**: `/container-size`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken`

### 8. Get Status Bongkar Muat Options
- **URL**: `/status-bongkar`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken`
