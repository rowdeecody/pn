# PROJECT_SPECIFICATION.md

## 1. Purpose

This document defines the technical and architectural specification for a modern frontend application built using **ReactJS**, **Vite**, **shadcn/ui**, **Tailwind CSS**, **Zod**, **Zustand**, and **Axios**.

The architecture follows a **page-oriented, feature-scoped structure** to improve scalability, ownership, and long-term maintainability.

---

## 2. Technology Stack

### Core
- **ReactJS 18+**
- **TypeScript**
- **Vite**
- **npm**

### UI & Styling
- **Tailwind CSS**
- **shadcn/ui**
- **Radix UI** (via shadcn/ui)
- **lucide-react**

### Design & Theme

- Background image: include a high-quality background asset for "Peso Net" in `src/assets/backgrounds/peso-net-bg.webp` (and a fallback `peso-net-bg.png`) and reference it from `styles/globals.css` and page-level components.
- Theme: "Game Interface" — neon / HUD-inspired visual language with bold display typography, high-contrast foreground, glowing accents, and thin chromatic outlines for buttons and cards.
- Effects & animation:
  - Use Tailwind utility classes and CSS custom properties for theme tokens (neon colors, glow radii).
  - Add subtle parallax layers (background, midground fog/particles, foreground HUD) implemented with CSS transforms or `framer-motion`.
  - Particle or light-scan overlay (low-opacity) to add motion to idle screen.
  - Coin insertion animation: coin drop → coin-to-hud motion + confetti burst (use CSS keyframes or `framer-motion`).
  - Remaining-time pulse and countdown subtle shake when <10s.
  - Mini overlay entrance: slide + scale with ease-out.
  - Chat message enter/exit animations and unread badge pulse.
  - Respect `prefers-reduced-motion` — provide reduced or static alternatives.
- Tools/libraries:
  - `framer-motion` for complex but accessible UI animations.
  - lightweight particle library or CSS-only approach for performance (optional).
- Implementation notes:
  - Add theme tokens in `tailwind.config.cjs` (colors: neonPrimary, neonAccent, bgGradient) and CSS variables in `styles/globals.css`.
  - Provide both animated (webp/apng) and static background fallbacks for performance and compatibility.
  - Ensure contrast/accessibility for HUD text and controls (WCAG AA where possible).

### State & Data
- **Zustand** – client-side state management
- **Zod** – schema validation & type inference
- **Axios** – HTTP client

### Tooling
- ESLint
- Prettier
- PostCSS

---

## 3. Architecture Principles

- Page-oriented domain structure
- Strong typing via Zod + TypeScript
- Local ownership of logic per page
- Minimal shared global state
- Clear separation of concerns:
  - UI
  - State
  - Validation
  - API / services
- Accessibility-first UI design

---

## 4. Project Structure

```txt
src/
├── assets/                    # Static assets (images, fonts, etc.)
├── components/
│   ├── ui/                    # shadcn/ui generated components
│   └── shared/                # App-wide reusable components
├── pages/
│   │ └── home/
│   │       ├── hooks/         # Page-specific hooks
│   │       ├── store/         # Zustand store (page-scoped)
│   │       ├── types/         # Page-specific TypeScript types
│   │       ├── schema/        # Zod schemas
│   │       ├── service/       # API/service logic
│   │       ├── constants/     # Page constants
│   │       └── index.tsx      # Home page entry
│   └── auth/
│       ├── components/
│       ├── api.ts
│       ├── schema.ts
│       └── store.ts
├── hooks/                     # Global reusable hooks
├── lib/
│   ├── axios.ts               # Axios instance
│   ├── utils.ts               # Utility functions
│   └── zod.ts                 # Shared Zod helpers
├── store/
│   └── index.ts               # Global Zustand store
├── styles/
│   └── globals.css
├── types/                     # Global shared types
├── App.tsx
├── main.tsx
└── vite-env.d.ts

```

---

## 5. Recommended files to scaffold (starter)

- `src/lib/axios.ts` — preconfigured Axios instance with base URL and interceptors
- `src/lib/zod.ts` — shared Zod helpers (e.g., parseSafe)
- `src/store/index.ts` — global Zustand store (UI-level)
- `src/features/pages/home/index.tsx` — sample page with local store and schema
- `src/features/pages/home/schema/index.ts` — example Zod schemas for the page
- `src/hooks/useIdle.ts` — reusable idle detection hook
- `src/services/api.ts` — thin wrapper around axios for typed calls
- `SPECIFICATION.md` — this file

---

## 6. Zod examples

Here's a minimal Zod schema example for a `PC` entity:

```ts
// src/features/pages/home/schema/pc.ts
import { z } from "zod";

export const PCSchema = z.object({
  id: z.number(),
  name: z.string(),
  remaining_time_seconds: z.number().optional(),
});

export type PC = z.infer<typeof PCSchema>;
```

And a transaction:

```ts
// src/features/pages/home/schema/transaction.ts
import { z } from "zod";

export const TransactionSchema = z.object({
  id: z.number(),
  pc_id: z.number().nullable(),
  amount: z.number(),
  type: z.string(),
  created_at: z.string().optional(),
});

export type Transaction = z.infer<typeof TransactionSchema>;
```

---

## 7. Example Axios instance

```ts
// src/lib/axios.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? "http://localhost:3000",
  timeout: 10000,
});

// optional: response interceptor for unified error handling
api.interceptors.response.use((r) => r, (err) => {
  // normalize or log
  return Promise.reject(err);
});
```

---

## 8. Minimal global store (Zustand)

```ts
// src/store/index.ts
import create from "zustand";

type UIState = {
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
};

export const useUIStore = create<UIState>((set) => ({
  theme: "light",
  setTheme: (t) => set({ theme: t }),
}));
```

---

## 9. Hooks: useIdle example

```ts
// src/hooks/useIdle.ts
import { useEffect, useRef, useState } from "react";

export function useIdle(timeoutSeconds = 60) {
  const [remaining, setRemaining] = useState(timeoutSeconds);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const reset = () => setRemaining(timeoutSeconds);
    const tick = () => setRemaining((r) => (r > 0 ? r - 1 : 0));

    const events = ["mousemove", "keydown", "click", "touchstart"];
    events.forEach((e) => window.addEventListener(e, reset));

    timer.current = window.setInterval(tick, 1000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [timeoutSeconds]);

  return remaining;
}
```

---

## 10. Acceptance criteria (high level)

- Provide a `SPECIFICATION.md` in the repo (this file).
- Scaffold basic starter files listed in section 5 if requested.
- Ensure Zod types are used for runtime validation and TypeScript type inference.
- Keep global state minimal; prefer page-scoped Zustand stores.

---

If you want I can:

1) Create the `SPECIFICATION.md` (project-level) and also scaffold the starter files listed in section 5.  
2) Only create `SPECIFICATION.md` and stop.  
3) Create `SPECIFICATION.md` and open a PR with the scaffolding changes.

Reply with the option number(s) you want (e.g. `1`, `2`, or `3`).
