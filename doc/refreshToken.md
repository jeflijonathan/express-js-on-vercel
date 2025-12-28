# Refresh Token Management API

Base URL: `/api/refresh-tokens`

## Endpoints

### 1. Get All Refresh Tokens
- **URL**: `/refresh-tokens`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Query Params**: `page`, `limit`, `userId`, `includeExpired`

### 2. Revoke Specific Refresh Token
- **URL**: `/refresh-tokens/:id`
- **Method**: `DELETE`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Response**: Confirms revocation. If it's the current session's token, the cookie will also be cleared.

### 3. Revoke All Tokens for a User
- **URL**: `/refresh-tokens/user/:userId`
- **Method**: `DELETE`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)

### 4. Revoke Batch of Tokens
- **URL**: `/refresh-tokens/revoke-batch`
- **Method**: `POST`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Payload**:
  ```json
  {
    "ids": ["uuid-1", "uuid-2", "uuid-3"]
  }
  ```
