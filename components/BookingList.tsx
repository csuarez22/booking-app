"use client"

import { useState } from "react"
import { Booking } from "@/types"
import BookingUpdate from "./BookingUpdate"

interface Props {
	bookings: Booking[]
	onDelete: (id: string) => void
	onUpdated: (updated: Booking) => void
}

function formatDate(iso: string) {
	return new Date(iso).toLocaleString(undefined, {
		dateStyle: "medium",
		timeStyle: "short",
	})
}

export default function BookingList({ bookings, onDelete, onUpdated }: Props) {
	const [editing, setEditing] = useState<Booking | null>(null)

	if (bookings.length === 0) {
		return (
			<div className="empty-state">
				<span className="empty-icon">📅</span>
				<p>No bookings yet. Create one above!</p>
			</div>
		)
	}

	return (
		<>
			<ul className="booking-list">
				{bookings.map((b) => (
					<li key={b.id} className="booking-card">
						<div className="booking-header">
							<span className="client-name">{b.clientName}</span>
							<div className="booking-actions">
								<button
									className="edit-btn"
									onClick={() => setEditing(b)}
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

			{editing && (
				<BookingUpdate
					booking={editing}
					onClose={() => setEditing(null)}
					onUpdated={(updated) => {
						onUpdated(updated)
						setEditing(null)
					}}
				/>
			)}
		</>
	)
}
