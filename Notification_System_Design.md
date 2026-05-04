# Stage 1: Notification System Design Document

## 1. Overview

CampusAlert is a campus notification system that shows notifications for three categories: **Events**, **Results**, and **Placements**. The frontend is a React application using Vite that fetches data from an API, handles filtering, pagination, and sorting for priority.

---

## 2. Architecture

```
┌─────────────────────────────────────────────────┐
│                   Browser (SPA)                 │
│                                                 │
│  ┌──────────┐  ┌───────────┐  ┌──────────────┐ │
│  │  Pages    │←→│  Hooks    │←→│  API / Utils │ │
│  │           │  │ (state)   │  │ (gateway,    │ │
│  │           │  │           │  │  logger)     │ │
│  └──────────┘  └───────────┘  └──────┬───────┘ │
│                                      │         │
│  ┌──────────┐  ┌───────────┐         │         │
│  │Components│  │  Helpers  │         │         │
│  │ (UI)     │  │ (sorting) │         │         │
│  └──────────┘  └───────────┘         │         │
└──────────────────────────────────────┼─────────┘
                                       │ HTTPS
                              ┌────────▼────────┐
                              │  Evaluation API │
                              │  /notifications │
                              │  /logs          │
                              └─────────────────┘
```

### Folder Structure

| Folder | Purpose |
|--------|---------|
| `src/api/` | Handles network requests, constants, and the logger |
| `src/helpers/` | Logic for sorting priority notifications |
| `src/hooks/` | Custom React hooks to fetch data |
| `src/components/` | Reusable React components like buttons and cards |
| `src/pages/` | Main page views for the application |

---

## 3. Priority Logic (Stage 1)

Notifications are sorted based on two rules:

1. **Category weight**: Placement (highest) > Result (medium) > Event (standard)
2. **Time**: If two notifications have the same weight, the newest one is shown first.

This logic makes sure that placement notifications are always seen first, followed by results, and then events. Time acts as the tie-breaker.

---

## 4. Logging Middleware

The app sends logs for important actions.

```json
{
  "stack": "frontend",
  "level": "info",
  "package": "api",
  "message": "Fetching notifications — page=1, type=Event",
  "timestamp": "2026-05-04T10:00:00.000Z"
}
```

The logs are printed in the browser console and sent to the `/logs` API route in the background so it doesn't slow down the user interface.

---

## 5. UI Features

| Component | Use |
|-----------|-----|
| `FeedSkeleton` | Shows loading animations while fetching |
| `ErrorMessage` | Shows error details and a retry button if the network fails |
| `NoData` | Shown when there are no notifications |
| `AlertCard` | Displays the notification details and highlights unread messages |

---

## 6. Routes

| URL | Page | Description |
|-----|------|-------------|
| `/` | `AllNotifications` | Shows all notifications with pagination and filters |
| `/priority` | `PriorityPage` | Shows the top N important notifications |

---

## 7. Choices Made

- Used normal `useState` instead of Redux to keep it simple.
- Put logic in custom hooks to keep components clean.
- Created simple folder names (`components`, `pages`, `api`) to be easy to understand.
