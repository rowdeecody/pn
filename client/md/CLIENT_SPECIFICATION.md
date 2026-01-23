# CLIENT_SPECIFICATION.md

## Purpose

This file documents the process flow for the client application pages and the user/session lifecycle. It is focused on page-level behavior, transitions, events, and validation — not on implementation details.

## Scope

- Screens: Registration -> Lock Screen -> Coin Modal -> Session (Unlocked) -> Mini Overlay -> Settings/Help -> Chat Box
- Events: app start, register, idle timeout, coin insert, socket updates, minimize/restore, tray actions, chat messages
- Validation: Zod schemas for inputs and incoming socket/rest payloads

---

## Page Flow (high level)

1. App Start
   - Load persisted state (pc.id, pc.name, session state) from electron-store via `useAppStore`.
   - On start the app will attempt to resolve the PC record (by stored pc.id or by IP/fingerprint). If the PC exists nothing further is required; otherwise begin registration automatically.
   - If no `pc.id` → navigate to Registration page or open registration modal.
   - If `pc.id` exists → connect Socket.IO and navigate to Lock Screen.

2. Registration Page / Modal
   - Purpose: create/register PC with server.
   - Actions: user optionally enters `pcName` or auto-generate fingerprint.
   - Submit: POST `/pcs/register` → validate response with Zod → persist `pc.id`, `pc.name` → emit `REGISTER_PC` on socket → close registration modal and display main page (Lock Screen).
   - After register the main page displays: title ("Peso Net"), PC name, remaining time, and an "Insert Coin" button. Idle timeout defaults to 60 seconds and will shutdown the app when reached.
   - Errors: show inline validation or server error toast; retry allowed.

3. Lock Screen (Kiosk)
   - Purpose: show PC name, remaining time, and allow coin insertion to start/extend session.
   - UI: PC name, remaining_time_seconds, "Insert Coin" button, Help/Settings.
   - Idle behavior: start idle countdown (configurable, default 60s). On zero → call `preload.shutdown()` (close app).
   - Actions:
     - Insert Coin → open Coin Modal.
     - Unlock (if required) → transition to Session (Unlocked).
     - Unlock/Login (account): if a user account exists, the Unlock page should offer an option to log in with credentials. Credentials are validated (Zod) and on successful authentication the session transitions to Session (Unlocked). Failed logins show inline errors and allow retry.
   - Incoming socket updates (e.g., NEW_TRANSACTION) update remaining time in real-time via Zod-validated payloads.

4. Coin Insert Modal
   - Purpose: collect coin amount/type and submit.
   - Validation: Zod schema for amount and optional fields.
   - Submission flow:
     - Emit `MONEY_IN` via Socket.IO with payload `{ pcId, amount }`.
     - POST `/transactions` (fallback) with same payload.
     - On success → update store (remaining time) and close modal.
     - On failure → show error and keep modal open for retry.

5. Session (Unlocked)
   - Purpose: allow normal app interactions while session active.
   - UI: main page(s) accessible; mini overlay can be shown on minimize or via tray.
   - Session expiration:
     - Server or local timer decrements remaining_time_seconds.
     - On reaching 0 → transition back to Lock Screen and optionally show expired toast.
   - Background behavior:
     - Socket connection stays active while app minimized, closed to tray, or running as mini overlay.
     - The user can minimize the main window to view a small always-on-top window (mini overlay) or close the window to the tray; the app continues running in background in both cases.
     - Tray supports Restore, Show Mini, Quit.

6. Mini Overlay
   - Purpose: small always-on-top control for quick coin inserts and status.
   - Visibility:
     - Shown after session unlocked OR when configured `SHOW_MINI_AFTER_SECONDS` passes.
     - Can be toggled from tray.
   - Interactions:
     - Quick Insert Opens small modal → same `MONEY_IN` flow.
     - Restore opens full app.

7. Chat Box
   - Purpose: enable user-to-admin and system messaging while in session or on lock screen (read-only or input depending on state).
   - Placement:
     - Small collapsible chat panel on Lock Screen and Session pages; integrated into Mini Overlay as an icon that opens the chat panel.
   - Features:
     - Receive messages via Socket.IO event `CHAT_MESSAGE` (payload validated by Zod).
     - Send messages via Socket.IO `CHAT_SEND` (payload `{ pcId, message }`) and optional REST fallback `POST /messages`.
     - Messages show timestamp, sender (system/admin/user), and message text. Support simple markdown/plain text.
     - Chat can be read-only on Lock Screen if desired (configurable).
   - UX rules:
     - Unread badge shown on chat icon when collapsed.
     - Limit message input to safe length (e.g., 500 chars) and validate with Zod.
     - Persist recent messages in memory and optionally in `electron-store` under `chat.history` (configurable).
     - Incoming admin/system commands via chat must be validated and routed to explicit action handlers (no direct store mutation).
   - Error handling:
     - Queue outgoing messages for REST fallback if socket is disconnected.
     - Show send failure indicators and allow retry.

8. Settings / Help
   - Accessible from Lock Screen and Session.
   - Allow editing `pc.name`, toggling idle timeout, and viewing logs.
   - Saves persist via `electron-store` through `preload.storeSet`.

---

## State & Validation

- Persisted keys: `pc.id`, `pc.name`, `settings.*`, `chat.history` (optional)
- Use Zod for:
  - Registration response
  - Transaction events (socket & REST)
  - Chat messages and commands
  - Settings inputs
- Keep page-scoped Zustand stores for UI-specific state; minimal global store for app-wide values (pc info, connection status, chat meta).

## Events & Error Handling

- Socket events:
  - Outgoing: `REGISTER_PC`, `MONEY_IN`, `CHAT_SEND`
  - Incoming: `NEW_TRANSACTION`, `COIN_TIMEOUT`, `PC_UPDATED`, `CHAT_MESSAGE`
- Error handling:
  - Network errors: show toast and allow retry; queue POST fallback for `MONEY_IN` and `CHAT_SEND` if socket fails.
  - Validation errors: block action and show inline messages.
  - Severe errors: if electron preload signals shutdown, ensure graceful cleanup.

## Navigation/UX Rules

- Registration is a one-time flow; after success always route to Lock Screen.
- Lock Screen is the default landing for locked/idle app.
- Session pages require `pc.id` and an unlocked session; if missing, redirect to Lock Screen.
- UI updates originating from sockets must be validated and applied to stores via explicit action creators to avoid stale state.
- Chat input and incoming commands must be validated and handled by explicit APIs; no direct store mutation from raw payloads.

## Acceptance checkpoints (process flow)

- On first run: registration completes and persisted keys exist.
- Lock Screen shows live remaining time and idle shutdown works.
- Coin insert updates remaining time via socket (and fallback REST) and UI reflects changes immediately.
- Minimize → app continues background socket/processing; mini overlay restores quick actions.
- Chat receives and sends messages reliably with socket primary and REST fallback.

---

Saved: automatically generated process-flow for client pages.
# CLIENT_SPECIFICATION.md

## Purpose

This file documents the process flow for the client application pages and the user/session lifecycle. It is focused on page-level behavior, transitions, events, and validation — not on implementation details.

## Scope

- Screens: Registration -> Lock Screen -> Coin Modal -> Session (Unlocked) -> Mini Overlay -> Settings/Help
- Events: app start, register, idle timeout, coin insert, socket updates, minimize/restore, tray actions
- Validation: Zod schemas for inputs and incoming socket/rest payloads

---

## Page Flow (high level)

1. App Start
   - Load persisted state (pc.id, pc.name, session state) from electron-store via `useAppStore`.
   - On start the app will attempt to resolve the PC record (by stored pc.id or by IP/fingerprint). If the PC exists nothing further is required; otherwise begin registration automatically.
   - If no `pc.id` → navigate to Registration page.
   - If `pc.id` exists → connect Socket.IO and navigate to Lock Screen.

2. Registration Page
   - Purpose: create/register PC with server.
   - Actions: user optionally enters `pcName` or auto-generate fingerprint.
   - Submit: POST `/pcs/register` → validate response with Zod → persist `pc.id`, `pc.name` → emit `REGISTER_PC` on socket → close registration modal and display main page (Lock Screen).
   - After register the main page displays: title ("Peso Net"), PC name, remaining time, and an "Insert Coin" button. Idle timeout defaults to 60 seconds and will shutdown the app when reached.
   - Errors: show inline validation or server error toast; retry allowed.

3. Lock Screen (Kiosk)
   - Purpose: show PC name, remaining time, and allow coin insertion to start/extend session.
   - UI: PC name, remaining_time_seconds, "Insert Coin" button, Help/Settings.
   - Idle behavior: start idle countdown (configurable, default 60s). On zero → call `preload.shutdown()` (close app).
   - Actions:
     - Insert Coin → open Coin Modal.
     - Unlock (if required) → transition to Session (Unlocked).
   - Incoming socket updates (e.g., NEW_TRANSACTION) update remaining time in real-time via Zod-validated payloads.

4. Coin Insert Modal
   - Purpose: collect coin amount/type and submit.
   - Validation: Zod schema for amount and optional fields.
   - Submission flow:
     - Emit `MONEY_IN` via Socket.IO with payload `{ pcId, amount }`.
     - POST `/transactions` (fallback) with same payload.
     - On success → update store (remaining time) and close modal.
     - On failure → show error and keep modal open for retry.

5. Session (Unlocked)
   - Purpose: allow normal app interactions while session active.
   - UI: main page(s) accessible; mini overlay can be shown on minimize or via tray.
   - Session expiration:
     - Server or local timer decrements remaining_time_seconds.
     - On reaching 0 → transition back to Lock Screen and optionally show expired toast.
   - Background behavior:
     - Socket connection stays active while app minimized, closed to tray, or running as mini overlay.
     - The user can minimize the main window to view a small always-on-top window (mini overlay) or close the window to the tray; the app continues running in background in both cases.
     - Tray supports Restore, Show Mini, Quit.

6. Mini Overlay
   - Purpose: small always-on-top control for quick coin inserts and status.
   - Visibility:
     - Shown after session unlocked OR when configured `SHOW_MINI_AFTER_SECONDS` passes.
     - Can be toggled from tray.
   - Interactions:
     - Quick Insert Opens small modal → same `MONEY_IN` flow.
     - Restore opens full app.

7. Settings / Help
   - Accessible from Lock Screen and Session.
   - Allow editing `pc.name`, toggling idle timeout, and viewing logs.
   - Saves persist via `electron-store` through `preload.storeSet`.

---

## State & Validation

- Persisted keys: `pc.id`, `pc.name`, `settings.*`
- Use Zod for:
  - Registration response
  - Transaction events (socket & REST)
  - Settings inputs
- Keep page-scoped Zustand stores for UI-specific state; minimal global store for app-wide values (pc info, connection status).

## Events & Error Handling

- Socket events:
  - Outgoing: `REGISTER_PC`, `MONEY_IN`
  - Incoming: `NEW_TRANSACTION`, `COIN_TIMEOUT`, `PC_UPDATED`
- Error handling:
  - Network errors: show toast and allow retry; queue POST fallback for `MONEY_IN` if socket fails.
  - Validation errors: block action and show inline messages.
  - Severe errors: if electron preload signals shutdown, ensure graceful cleanup.

## Navigation/UX Rules

- Registration is a one-time flow; after success always route to Lock Screen.
- Lock Screen is the default landing for locked/idle app.
- Session pages require `pc.id` and an unlocked session; if missing, redirect to Lock Screen.
- UI updates originating from sockets must be validated and applied to stores via explicit action creators to avoid stale state.

## Acceptance checkpoints (process flow)

- On first run: registration completes and persisted keys exist.
- Lock Screen shows live remaining time and idle shutdown works.
- Coin insert updates remaining time via socket (and fallback REST) and UI reflects changes immediately.
- Minimize → app continues background socket/processing; mini overlay restores quick actions.

---

Saved: automatically generated process-flow for client pages.

# CLIENT_SPECIFICATION.md

## Purpose

This file documents the process flow for the client application pages and the user/session lifecycle. It is focused on page-level behavior, transitions, events, and validation — not on implementation details.

## Scope

- Screens: Registration -> Lock Screen -> Coin Modal -> Session (Unlocked) -> Mini Overlay -> Settings/Help
- Events: app start, register, idle timeout, coin insert, socket updates, minimize/restore, tray actions
- Validation: Zod schemas for inputs and incoming socket/rest payloads

---

## Page Flow (high level)

1. App Start
   - Load persisted state (pc.id, pc.name, session state) from electron-store via `useAppStore`.
   - If no `pc.id` → navigate to Registration page.
   - If `pc.id` exists → connect Socket.IO and navigate to Lock Screen.

2. Registration Page
   - Purpose: create/register PC with server.
   - Actions: user optionally enters `pcName` or auto-generate fingerprint.
   - Submit: POST `/pcs/register` → validate response with Zod → persist `pc.id`, `pc.name` → emit `REGISTER_PC` on socket → navigate to Lock Screen.
   - Errors: show inline validation or server error toast; retry allowed.

3. Lock Screen (Kiosk)
   - Purpose: show PC name, remaining time, and allow coin insertion to start/extend session.
   - UI: PC name, remaining_time_seconds, "Insert Coin" button, Help/Settings.
   - Idle behavior: start idle countdown (configurable, default 60s). On zero → call `preload.shutdown()` (close app).
   - Actions:
     - Insert Coin → open Coin Modal.
     - Unlock (if required) → transition to Session (Unlocked).
   - Incoming socket updates (e.g., NEW_TRANSACTION) update remaining time in real-time via Zod-validated payloads.

4. Coin Insert Modal
   - Purpose: collect coin amount/type and submit.
   - Validation: Zod schema for amount and optional fields.
   - Submission flow:
     - Emit `MONEY_IN` via Socket.IO with payload `{ pcId, amount }`.
     - POST `/transactions` (fallback) with same payload.
     - On success → update store (remaining time) and close modal.
     - On failure → show error and keep modal open for retry.

5. Session (Unlocked)
   - Purpose: allow normal app interactions while session active.
   - UI: main page(s) accessible; mini overlay can be shown on minimize or via tray.
   - Session expiration:
     - Server or local timer decrements remaining_time_seconds.
     - On reaching 0 → transition back to Lock Screen and optionally show expired toast.
   - Background behavior:
     - Socket connection stays active while app minimized or in mini overlay mode.
     - Tray supports Restore, Show Mini, Quit.

6. Mini Overlay
   - Purpose: small always-on-top control for quick coin inserts and status.
   - Visibility:
     - Shown after session unlocked OR when configured `SHOW_MINI_AFTER_SECONDS` passes.
     - Can be toggled from tray.
   - Interactions:
     - Quick Insert Opens small modal → same `MONEY_IN` flow.
     - Restore opens full app.

7. Settings / Help
   - Accessible from Lock Screen and Session.
   - Allow editing `pc.name`, toggling idle timeout, and viewing logs.
   - Saves persist via `electron-store` through `preload.storeSet`.

---

## State & Validation

- Persisted keys: `pc.id`, `pc.name`, `settings.*`
- Use Zod for:
  - Registration response
  - Transaction events (socket & REST)
  - Settings inputs
- Keep page-scoped Zustand stores for UI-specific state; minimal global store for app-wide values (pc info, connection status).

## Events & Error Handling

- Socket events:
  - Outgoing: `REGISTER_PC`, `MONEY_IN`
  - Incoming: `NEW_TRANSACTION`, `COIN_TIMEOUT`, `PC_UPDATED`
- Error handling:
  - Network errors: show toast and allow retry; queue POST fallback for `MONEY_IN` if socket fails.
  - Validation errors: block action and show inline messages.
  - Severe errors: if electron preload signals shutdown, ensure graceful cleanup.

## Navigation/UX Rules

- Registration is a one-time flow; after success always route to Lock Screen.
- Lock Screen is the default landing for locked/idle app.
- Session pages require `pc.id` and an unlocked session; if missing, redirect to Lock Screen.
- UI updates originating from sockets must be validated and applied to stores via explicit action creators to avoid stale state.

## Acceptance checkpoints (process flow)

- On first run: registration completes and persisted keys exist.
- Lock Screen shows live remaining time and idle shutdown works.
- Coin insert updates remaining time via socket (and fallback REST) and UI reflects changes immediately.
- Minimize → app continues background socket/processing; mini overlay restores quick actions.

---

Saved: automatically generated process-flow for client pages.
