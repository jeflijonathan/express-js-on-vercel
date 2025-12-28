# Activity Logs API

Base URL: `/api/activity-logs`

## Endpoints

### 1. Get All Activity Logs
- **URL**: `/activity-logs`
- **Method**: `GET`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
- **Query Params**: `page`, `limit`, `search`, `userId`, `action`

### 2. Delete Activity Log
- **URL**: `/activity-logs/:id`
- **Method**: `DELETE`
- **Headers**: Requires valid `accessToken` (Role: MANAJER)
