# Paradocs

Paradocs is a collaborative rich-text document editor built to demonstrate real-time web application patterns. Multiple authenticated users can edit a shared document at the same time, see live cursors, and have their collaborative state persisted to PostgreSQL.

> This project is intended to run locally. Its demo flow is two authenticated browser sessions editing the same shared document.

## Demo

![Paradocs collaborative editing demo](/static/paradocs.gif)

## Highlights

- Concurrent rich-text editing with **Yjs** CRDTs
- Live collaborator cursors and selections via Yjs awareness
- Authenticated, document-scoped WebSocket rooms
- PostgreSQL persistence of collaborative Yjs state
- Debounced persistence to avoid a database write per keystroke
- Owner, editor, and viewer sharing roles
- Tiptap toolbar with formatting, tables, images, and document exports

## Tech stack

| Area                    | Tools                                            |
| ----------------------- | ------------------------------------------------ |
| Frontend                | Next.js, React, TypeScript, Tailwind CSS, Tiptap |
| Real-time collaboration | Yjs, y-websocket, y-prosemirror                  |
| Backend                 | Express, Node.js, `ws`                           |
| Database                | PostgreSQL, Prisma                               |
| Authentication          | Kinde, signed JWTs                               |

## How collaboration works

Each editable document maps to a Yjs document whose name is the Paradocs document ID.

```text
Editor browser ─┐
                ├── authenticated WebSocket room ── Yjs document ── PostgreSQL
Editor browser ─┘                 │
                                  └── awareness: names, selections, cursors
```

- Tiptap is bound to a `Y.XmlFragment` with `y-prosemirror`.
- Yjs merges concurrent operations, so one user’s edit does not overwrite another user’s work.
- Cursor and selection data is sent through Yjs awareness and rendered in the editor.
- The server stores a Yjs state snapshot in `Document.yjsState` after one second of inactivity, and flushes it when the last connection leaves.

## Roles

| Role   | Access                                    |
| ------ | ----------------------------------------- |
| Owner  | Full document access and sharing controls |
| Editor | Can edit document content and title       |
| Viewer | Read-only editor interface                |

The REST write endpoints require the owner or an `EDITOR` collaboration role. The editor UI is read-only for viewers.

## Prerequisites

- Node.js 18 or newer
- PostgreSQL (Docker is fine)
- A Kinde application configured for local development
- npm or Yarn

## Local setup

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Configure the server environment in `apps/server/.env`:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/paradocs"
   JWT_SECRET="replace-with-a-long-random-secret"
   JWT_EXPIRY="7d"
   ```

3. Configure the web environment in `apps/web/.env.local`:

   ```env
   NEXT_PUBLIC_BACKEND_URL="http://localhost:8080"
   NEXT_PUBLIC_FRONTEND_URL="http://localhost:3000"

   NEXT_PUBLIC_ISSUER_URL="..."

   KINDE_CLIENT_ID="..."
   KINDE_CLIENT_SECRET="..."
   KINDE_ISSUER_URL="..."
   KINDE_SITE_URL="http://localhost:3000"
   KINDE_POST_LOGIN_REDIRECT_URL="http://localhost:3000/api/auth/success"
   KINDE_POST_LOGOUT_REDIRECT_URL="http://localhost:3000"
   ```

4. Create/update the database schema and Prisma client:

   ```bash
   cd apps/server
   npx prisma db push
   npx prisma generate
   ```

5. Start the server:

   ```bash
   cd apps/server
   npm run dev
   ```

6. In a second terminal, start the web app:

   ```bash
   cd apps/web
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Demo checklist

1. Sign into two separate accounts using two browsers or one normal window and one private window.
2. Create a document as the first user.
3. Share it with the second user as an `EDITOR`.
4. Open the same document in both sessions.
5. Type simultaneously, move cursors, and select text in both windows.
6. Wait a second after editing, refresh the page, and verify the document state persists.
7. Share a document as a `VIEWER` to verify the read-only experience.

## Useful commands

```bash
# Type-check the web app
npm run check-types --workspace=web

# Build the server
npm run build --workspace=server

# Build all workspaces
npm run build
```

## Project structure

```text
apps/
├── server/
│   ├── prisma/                 # Prisma schema and PostgreSQL model
│   └── src/
│       ├── loaders/websocket.loader.ts  # Yjs WebSocket server and persistence
│       └── services/           # Document, sharing, and authorization logic
└── web/
    └── app/
        ├── documents/[documentId]/       # Collaborative editor route
        ├── hooks/useYjsCollaboration.ts  # Browser Yjs connection
        └── lib/extensions/yjsCollaboration.ts
```

## Limitations and next steps

- The editor is a continuous document rather than a true paginated Google Docs layout.
- Viewer real-time access should be hardened with a server-side read-only Yjs protocol handler before a production deployment.
- Version history, comments, and offline-first support are future enhancements.

## License

This project is for portfolio and learning purposes.
