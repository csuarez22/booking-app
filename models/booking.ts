import { Booking, NewBooking } from "@/types"
import { randomUUID } from "crypto"

export function createBooking(data: NewBooking): Booking {
	return {
		...data,
		id: randomUUID(),
		notes: data.notes ?? null,
		createdAt: new Date().toISOString(),
	}
}

export function hasDateOverlap(
	existing: Booking[], //current bookings of the store
	startDate: string,
	endDate: string,
	excludeId?: string, //id of the booking we're about to add or update, so we don't compare it with itself
): boolean {
	const newStart = new Date(startDate).getTime()
	const newEnd = new Date(endDate).getTime()

	return existing
		.filter((b) => b.id !== excludeId)
		.some((b) => {
			const existingStart = new Date(b.startDate).getTime()
			const existingEnd = new Date(b.endDate).getTime()
			// Overlap when one range starts before the other ends
			return newStart < existingEnd && newEnd > existingStart
		})
}
