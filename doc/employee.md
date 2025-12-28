# Employee Management API

Base URL: `/api/employee`

## Endpoints

### 1. Get All Employees
- **URL**: `/employee`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Query Params**: `page`, `limit`, `search`

### 2. Get Employee by ID
- **URL**: `/employee/:id`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)

### 3. Create Employee
- **URL**: `/employee`
- **Method**: `POST`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Payload**:
  ```json
  {
    "namaLengkap": "John Doe",
    "nik": "1234567890",
    "jabatan": "Kuli",
    "noHp": "08123456789"
  }
  ```

### 4. Update Employee
- **URL**: `/employee/:id`
- **Method**: `PUT`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Payload**: Updated employee fields.
