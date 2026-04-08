"use client"

import { useState } from "react"
import { Booking } from "@/types"

interface Props {
	bookings: Booking[]
	onDelete: (id: string) => void
	onEdit: (booking: Booking) => void
}

function formatDate(iso: string) {
	return new Date(iso).toLocaleString(undefined, {
		dateStyle: "medium",
		timeStyle: "short",
	})
}

export default function BookingList({ bookings, onDelete, onEdit }: Props) {
	const [filterStart, setFilterStart] = useState("")
	const [filterEnd, setFilterEnd] = useState("")

	const filtered = bookings.filter((b) => {
		const bookingStart = b.startDate.slice(0, 10) // "yyyy-mm-dd"
		const bookingEnd = b.endDate.slice(0, 10)
		const start = filterStart ? bookingStart >= filterStart : true
		const end = filterEnd ? bookingEnd <= filterEnd : true
		return start && end
	})

	const hasFilters = filterStart || filterEnd

	if (bookings.length === 0) {
		return (
			<div className="empty-state">
				<span className="empty-icon">📅</span>
				<p>No bookings yet. Create one!</p>
			</div>
		)
	}

	return (
		<>
			<div className="filter-row">
				<label>
					From
					<input
						type="date"
						value={filterStart}
						onChange={(e) => setFilterStart(e.target.value)}
					/>
				</label>
				<label>
					To
					<input
						type="date"
						value={filterEnd}
						onChange={(e) => setFilterEnd(e.target.value)}
					/>
				</label>
				{hasFilters && (
					<button
						className="btn-clear"
						onClick={() => {
							setFilterStart("")
							setFilterEnd("")
						}}
					>
						Clear
					</button>
				)}
			</div>

			{filtered.length === 0 ? (
				<div className="empty-state">
					<span className="empty-icon">📅</span>
					<p>
						{hasFilters
							? "No bookings match your filter."
							: "No bookings yet. Create one above!"}
					</p>
				</div>
			) : (
				<ul className="booking-list">
					{filtered.map((b) => (
						<li key={b.id} className="booking-card">
							<div className="booking-header">
								<span className="client-name">{b.clientName}</span>
								<div className="booking-actions">
									<button
										className="edit-btn"
										onClick={() => onEdit(b)}
										title="Edit booking"
									>
										✎
									</button>
									<button
										className="delete-btn"
										onClick={() => onDelete(b.id)}
										title="Cancel booking"
									>
										✕
									</button>
								</div>
							</div>
							<div className="booking-dates">
								<span>🕐 {formatDate(b.startDate)}</span>
								<span className="arrow">→</span>
								<span>🕐 {formatDate(b.endDate)}</span>
							</div>
							{b.notes && <p className="booking-notes">{b.notes}</p>}
							<p className="booking-meta">Booked on {formatDate(b.createdAt)}</p>
						</li>
					))}
				</ul>
			)}
		</>
	)
}
