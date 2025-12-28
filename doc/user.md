# User Management API

Base URL: `/api/users`

## Endpoints

### 1. Get All Users
- **URL**: `/users`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Query Params**: `page`, `limit`, `search`

### 2. Get User by ID
- **URL**: `/users/:id`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)

### 3. Create User with Employee ID
- **URL**: `/users/create/user-with-employee-id`
- **Method**: `POST`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Payload**:
  ```json
  {
    "username": "user123",
    "password": "password",
    "roleId": "uuid",
    "employeeId": "uuid"
  }
  ```

### 4. Create User and Employee (Simultaneously)
- **URL**: `/users/create/user-employee`
- **Method**: `POST`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Payload**: Detailed user and employee data.

### 5. Update User
- **URL**: `/users/:id`
- **Method**: `PUT`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Payload**: Updated user data.
