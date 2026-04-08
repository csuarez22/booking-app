import { Store, Booking, NewBooking } from "@/types"
import { createBooking, hasDateOverlap } from "@/models/booking"

export function createStore(name: string): Store {
	return { name, bookings: [] }
}

function formatDate(iso: string): string {
	const d = new Date(iso)
	const yyyy = d.getFullYear()
	const mm = String(d.getMonth() + 1).padStart(2, "0")
	const dd = String(d.getDate()).padStart(2, "0")
	const hour = String(d.getHours()).padStart(2, "0")
	const minute = String(d.getMinutes()).padStart(2, "0")
	return `${yyyy}/${mm}/${dd}, ${hour}:${minute}`
}

export function addBookingToStore(store: Store, data: NewBooking, id?: string): Booking {
	if (hasDateOverlap(store.bookings, data.startDate, data.endDate, id)) {
		throw new Error(
			`Date conflict: the store already has a booking that overlaps with ${formatDate(data.startDate)} - ${formatDate(data.endDate)}.`,
		)
	}
	const booking = createBooking(data)
	store.bookings.push(booking)
	return booking
}

export function removeBookingFromStore(store: Store, id: string): boolean {
	const index = store.bookings.findIndex((b) => b.id === id)
	if (index === -1) return false
	store.bookings.splice(index, 1)
	return true
}

export function getBookingsFromStore(store: Store): Booking[] {
	//we don't want to mutate the original array, so we create a copy of it and sort the copy by startDate
	const bookings = [...store.bookings]
	return bookings.sort(
		(a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
	)
}
