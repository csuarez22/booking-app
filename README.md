# Store Booking Manager

A lightweight appointment booking pp built with Next.js 15 and TypeScript. No database required — bookings are persisted in a local JSON file that is created automatically on first run.

As this was my first venture with NextJS, Claude Code was heavily used in the creation of this project, mostly to generate the components' HTML and styles, as well as some auxiliary functions. Copilot was also used lightly to fix minor issues. The rest was mostly approached by reading the NextJS and React documentations, and figuring things out as I went.

## Features

- Create, edit, and cancel bookings
- Automatic overlap detection — no two bookings can share the same time slot
- Filter bookings by date range
- Toast notifications on create, update, and delete
- Bookings sorted chronologically at all times

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Sonner** for toast notifications
- JSON file for persistence (no database)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | Returns the store name and all bookings sorted by start date |
| GET | `/api/bookings/:id` | Returns existing booking |
| POST | `/api/bookings` | Creates a new booking |
| PATCH | `/api/bookings/:id` | Updates an existing booking |
| DELETE | `/api/bookings/:id` | Deletes a booking |

### Booking shape

```ts
{
  id: string;          // Auto-generated UUID
  clientName: string;
  storeName: string;
  startDate: string;   // ISO 8601
  endDate: string;     // ISO 8601
  notes?: string | null;
  createdAt: string;   // ISO 8601
}
```

### POST / PATCH body

```json
{
  "clientName": "Jane Doe",
  "storeName": "My Bookings Store",
  "startDate": "2026-04-10T10:00:00.000Z",
  "endDate": "2026-04-10T11:00:00.000Z",
  "notes": "Bring the invoice"
}
```

**Overlap detection** checks whether any existing booking shares time with the requested slot using the condition `newStart < existingEnd && newEnd > existingStart`, which correctly catches all overlap cases including partial overlaps and one booking fully containing another.

**State is lifted** to `page.tsx` so that `BookingForm`, `BookingList` and `BookingUpdate` stay simple — they receive data and callbacks as props and don't need to talk to each other directly.

## Notes

- `data/store.json` is gitignored so bookings are never committed to source control.
- Date formatting uses local timezone. If the app is deployed, server and client timezones may differ.
- For production use, the JSON file approach should be replaced with a proper database such as PostgreSQL via Prisma.
