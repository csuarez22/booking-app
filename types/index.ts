export interface Booking {
	id: string
	clientName: string
	storeName: string
	startDate: string 
	endDate: string 
	notes?: string | null
	createdAt: string
}

export type NewBooking = Omit<Booking, "id" | "createdAt">

export interface Store {
	name: string
	bookings: Booking[]
}
