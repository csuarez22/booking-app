import { NextResponse } from "next/server"
import { readStore, writeStore } from "@/lib/persistence"
import { addBookingToStore, getBookingsFromStore, removeBookingFromStore } from "@/models/store"
import { NewBooking } from "@/types"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
	const booking = getBookingsFromStore(readStore()).find(async (b) => b.id === (await params).id)

	if (!booking) {
		return NextResponse.json({ error: "Booking not found." }, { status: 404 })
	}

	return NextResponse.json(booking)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
	const store = readStore()
	const removed = removeBookingFromStore(store, (await params).id)

	if (!removed) {
		return NextResponse.json({ error: "Booking not found." }, { status: 404 })
	}

	writeStore(store)
	return NextResponse.json({ message: "Booking deleted." })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
		const booking = addBookingToStore(store, body as NewBooking)
		//we remove the booking and then add it again with the new data
		removeBookingFromStore(store, (await params).id)
		writeStore(store)
		return NextResponse.json(booking, { status: 201 })
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Unknown error"
		return NextResponse.json({ error: message }, { status: 409 })
	}
}
