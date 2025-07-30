# API Client Migration

## Overview

This document describes the migration from hardcoded localhost URLs to centralized API client configuration.

## Changes Made

### 1. Updated Files

- `src/ui/CategoryNav.jsx` - Replaced hardcoded axios call with apiClient
- `src/pages/EventListByCategory.jsx` - Replaced hardcoded axios call with apiClient
- `src/pages/NotificationSocket.jsx` - Replaced hardcoded WebSocket URL with centralized config
- `src/hooks/useWebSocket.jsx` - Replaced hardcoded WebSocket URL with centralized config
- `src/hooks/useChat.jsx` - Replaced hardcoded WebSocket URL with centralized config
- `src/api/axios.js` - Updated to use environment variables for base URL and refresh token URL
- `vite.config.js` - Updated proxy configuration to use environment variables

### 2. New Files

- `src/api/websocket.js` - Centralized WebSocket URL configuration

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:8080/api

# WebSocket Configuration
VITE_WS_URL=http://localhost:8080
```

## Benefits

1. **Centralized Configuration**: All API and WebSocket URLs are now managed in one place
2. **Environment Flexibility**: Easy to switch between development, staging, and production environments
3. **Consistency**: All API calls now use the same apiClient with proper interceptors
4. **Maintainability**: Easier to update URLs and add new features like authentication headers

## Usage

### API Calls

```javascript
import apiClient from "../api/axios";

// Make API calls
const response = await apiClient.get("/categories");
const response = await apiClient.post("/events", eventData);
```

### WebSocket Connections

```javascript
import getWebSocketUrl from "../api/websocket";

const socket = new SockJS(getWebSocketUrl());
```

## Migration Checklist

- [x] Replace hardcoded axios calls with apiClient
- [x] Replace hardcoded WebSocket URLs with centralized config
- [x] Update environment variable usage
- [x] Update proxy configuration
- [x] Create documentation
