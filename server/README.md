# Peso Net Server

A comprehensive Node.js server for managing Peso Net (Pisonet) systems.

## Features
- **Offline Capable**: Uses local SQLite database and session-based auth.
- **Real-time**: WebSockets for instant PC commands and coin updates.
- **Client Management**: API for PC clients to register and sync time.
- **Hardware Integration**: Endpoints for Coin Acceptor interaction.
- **Admin Control**: Manage PCs, view reports, and settings.

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm

### Installation
1.  Navigate to the directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    npm run dev
    ```

## API Documentation
Base URL: `http://localhost:3000/api/v1`

### Authentication
- `POST /auth/login` - `{ username, password }` (Default: admin / admin123)
- `POST /auth/logout`
- `GET /auth/me`

### Client (PC)
- `POST /clients/register` - `{ mac_address, ip_address, name }`
- `POST /clients/heartbeat` - `{ pc_id }`
- `POST /clients/request-coin` - `{ pc_id }` (Sets PC to wait for coin)
- `POST /clients/cancel-coin` - `{ pc_id }`

### Hardware (Coin Slot)
- `POST /hardware/coin` - `{ amount: 1 }` (Adds time to valid Active PC)

### Admin
- `GET /admin/pcs` - List all PCs
- `POST /admin/pcs/:id/command` - Send command (`lock`, `unlock`, `shutdown`, `restart`, `add_time`)

## WebSocket
Connect to: `ws://localhost:3000/ws/v1`
Events: `MONEY_IN`, `COMMAND`, `PC_ACTIVE_FOR_COIN`
