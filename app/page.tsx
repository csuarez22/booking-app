"use client"

import { useEffect, useState } from "react"
import BookingForm from "@/components/BookingForm"
import BookingList from "@/components/BookingList"
import { Booking } from "@/types"
import BookingUpdate from "@/components/BookingUpdate"

export default function HomePage() {
	const [storeName, setStoreName] = useState("My Bookings Store")
	const [bookings, setBookings] = useState<Booking[]>([])
	const [loading, setLoading] = useState(true)

	//editing controls visibility of modal BookingUpdate. When null, modal is closed. When set to a booking, modal opens with that booking's data
	const [editing, setEditing] = useState<Booking | null>(null)

	useEffect(() => {
		handleLoading()
	}, [])

	const handleLoading = () => {
		fetch("/api/bookings")
			.then((r) => r.json())
			.then((data) => {
				setStoreName(data.storeName)
				setBookings(
					data.bookings.sort( //sort the bookings by date when loading them
						(a: Booking, b: Booking) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
					),
				)
			})
			.finally(() => setLoading(false))
	}

	const handleBooked = (booking: Booking) => {
		setBookings((prev) =>
			[...prev, booking].sort(
				(a: Booking, b: Booking) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
			),
		)
	}

	const handleDelete = async (id: string) => {
		const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" })

		if (res.ok) setBookings((prev) => prev.filter((b) => b.id !== id))
	}

	const handleUpdated = (updated: Booking) => {
		handleLoading() //reload the bookings
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
					<BookingForm 
                        storeName={storeName} 
                        onBooked={handleBooked} 
                    />
				</section>

				<section className="panel">
					<h2>
						Current Bookings
						<span className="badge">{bookings.length}</span>
					</h2>
					{loading ? (
						<p className="loading">Loading bookings…</p>
					) : (
						<BookingList
							bookings={bookings}
							onDelete={handleDelete}
							onEdit={(booking) => setEditing(booking)}
						/>
					)}
				</section>
			</div>

			{editing && (
				<BookingUpdate
					booking={editing}
					onClose={() => setEditing(null)}
					onUpdated={(updated) => {
						handleUpdated(updated)
						setEditing(null)
					}}
				/>
			)}
		</main>
	)
}
