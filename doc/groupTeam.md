# Group Team API

Base URL: `/api/group-team`

## Endpoints

### 1. Get All Group Teams
- **URL**: `/group-team`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Query Params**: `page`, `limit`

### 2. Get Group Team by ID
- **URL**: `/group-team/:id`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)

### 3. Create Group Team
- **URL**: `/group-team`
- **Method**: `POST`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Payload**:
  ```json
  {
    "name": "Team A",
    "memberIds": ["uuid-1", "uuid-2"]
  }
  ```

### 4. Update Group Team
- **URL**: `/group-team/:id`
- **Method**: `PUT`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Payload**: Updated team data.

### 5. Delete Group Team
- **URL**: `/group-team/:id`
- **Method**: `DELETE`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
