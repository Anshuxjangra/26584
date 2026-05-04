# Notification App — Backend (Placeholder)

> This directory is reserved for the backend implementation of the Campus Notification System.  
> The **frontend track** was chosen for this evaluation, so no backend code is included here.

## API Reference

The frontend communicates with the hosted evaluation API:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET`  | `/evaluation-service/notifications` | Fetch paginated notifications |
| `POST` | `/evaluation-service/logs` | Ship client-side log entries |

### Query Parameters (GET /notifications)

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (1-based) |
| `limit` | number | Items per page |
| `notification_type` | string | One of `Event`, `Result`, `Placement` |
