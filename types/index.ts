export interface Booking {
	id: string
	clientName: string
	storeName: string
	startDate: string // ISO 8601
	endDate: string // ISO 8601
	notes?: string | null
	createdAt: string
}

export type NewBooking = Omit<Booking, "id" | "createdAt">

export interface Store {
	name: string
	bookings: Booking[]
}
