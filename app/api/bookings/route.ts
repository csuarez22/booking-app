import { NextResponse } from "next/server"
import { readStore, writeStore } from "@/lib/persistence"
import { addBookingToStore, getBookingsFromStore } from "@/models/store"
import { NewBooking } from "@/types"

export async function GET() {
	const store = readStore()
	return NextResponse.json({
		storeName: store.name,
		bookings: getBookingsFromStore(store),
	})
}

export async function POST(req: Request) {
	const body = (await req.json()) as Partial<NewBooking>

	if (!body.clientName || !body.storeName || !body.startDate || !body.endDate) {
		return NextResponse.json(
			{ error: "Client Name, Store Name, Start Date, and End Date are required." },
			{ status: 400 },
		)
	}

	if (new Date(body.startDate) >= new Date(body.endDate)) {
		return NextResponse.json({ error: "Start Date must be before End Date." }, { status: 400 })
	}

	const store = readStore()

	try {
        //addBookingToStore already checks if dates overlap
		const booking = addBookingToStore(store, body as NewBooking)
		writeStore(store)
		return NextResponse.json(booking, { status: 201 })
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Unknown error."
		return NextResponse.json({ error: message }, { status: 409 })
	}
}
