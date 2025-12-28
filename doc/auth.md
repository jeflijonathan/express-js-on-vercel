# Authentication & Profile API

Base URL: `/api/auth` (Assuming standard prefix)

## Endpoints

### 1. Login
- **URL**: `/login`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```
- **Response**: Returns `accessToken` and sets `refreshToken` in HttpOnly cookie.

### 2. Refresh Token
- **URL**: `/refresh`
- **Method**: `POST`
- **Headers**: Requires valid `accessToken`
- **Cookies**: Requires valid `refreshToken`
- **Response**: Returns new `accessToken` and updates `refreshToken` cookie.

### 3. Logout
- **URL**: `/logout`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken`
- **Response**: Revokes refresh token and clears cookie.

### 4. Edit Profile
- **URL**: `/profile/:id`
- **Method**: `PUT`
- **Headers**: Requires valid `accessToken`
- **Payload**: (Depends on fields to be updated, e.g., name, email)
- **Response**: Updated user profile.

### 5. Send Verification (Forgot Password)
- **URL**: `/send-verification`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "email": "user@example.com"
  }
  ```

### 6. Verify Code
- **URL**: `/verify-code`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "email": "user@example.com",
    "code": "123456"
  }
  ```

### 7. Reset Password
- **URL**: `/reset-password`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "email": "user@example.com",
    "code": "123456",
    "password": "new_password"
  }
  ```
