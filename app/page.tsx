"use client"

import { useEffect, useState } from "react"
import BookingForm from "@/components/BookingForm"
import BookingList from "@/components/BookingList"
import { Booking } from "@/types"

export default function HomePage() {
	const [storeName, setStoreName] = useState("My Bookings Store")
	const [bookings, setBookings] = useState<Booking[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetch("/api/bookings")
			.then((r) => r.json())
			.then((data) => {
				setStoreName(data.storeName)
				setBookings(data.bookings)
			})
			.finally(() => setLoading(false))
	}, [])

	const handleBooked = (booking: Booking) => {
		setBookings((prev) =>
			[...prev, booking].sort(
				(a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
			),
		)
	}

	const handleDelete = async (id: string) => {
		const res = await fetch(
            `/api/bookings/${id}`, 
            { method: "DELETE" }
        )
        
		if (res.ok) 
            setBookings((prev) => prev.filter((b) => b.id !== id))
	}

	const handleUpdated = (updated: Booking) => {
		setBookings((prev) =>
			prev
				.map((b) => (b.id === updated.id ? updated : b))
				.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()),
		)
	}

	return (
		<main>
			<header className="site-header">
				<div className="header-inner">
					<span className="store-badge">🏪</span>
					<div>
						<h1>{storeName}</h1>
						<p className="subtitle">Appointment &amp; Booking Manager</p>
					</div>
				</div>
			</header>

			<div className="content">
				<section className="panel">
					<BookingForm storeName={storeName} onBooked={handleBooked} />
				</section>

				<section className="panel">
					<h2>
						Current Bookings
						<span className="badge">{bookings.length}</span>
					</h2>
					{loading ? (
						<p className="loading">Loading bookings…</p>
					) : (
						<BookingList bookings={bookings} onDelete={handleDelete} onUpdated={handleUpdated} />
					)}
				</section>
			</div>
		</main>
	)
}
