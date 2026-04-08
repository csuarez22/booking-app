"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Booking } from "@/types"
import { toDateTimeLocal } from "@/app/auxFunctions/functions"
import { toast } from "sonner"

interface Props {
	booking: Booking
	onClose: () => void
	onUpdated: (updated: Booking) => void
}

export default function BookingUpdate({ booking, onClose, onUpdated }: Props) {
	const [form, setForm] = useState({
		clientName: booking.clientName,
		startDate: toDateTimeLocal(booking.startDate),
		endDate: toDateTimeLocal(booking.endDate),
		notes: booking.notes ?? "",
	})
	const [loading, setLoading] = useState(false)
	const [mounted, setMounted] = useState(false)

	// Wait for client mount before rendering the portal
	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose()
		}
		window.addEventListener("keydown", onKey)
		return () => window.removeEventListener("keydown", onKey)
	}, [onClose])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)

		const res = await fetch(`/api/bookings/${booking.id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				clientName: form.clientName,
				startDate: new Date(form.startDate).toISOString(),
				endDate: new Date(form.endDate).toISOString(),
				notes: form.notes || null,
			}),
		})

		const data = await res.json()
		setLoading(false)

		if (!res.ok) {
            toast.error(data.error ?? "Something went wrong.")
		} else {
            toast.success("Booking updated successfully.");
			onUpdated(data as Booking)
			onClose()
		}
	}

	if (!mounted) return null

	return createPortal(
		<div className="modal-backdrop" onClick={onClose}>
			<div className="modal" onClick={(e) => e.stopPropagation()}>
				<div className="modal-header">
					<h2>Edit Booking</h2>
					<button className="modal-close" onClick={onClose}>
						✕
					</button>
				</div>

				<form onSubmit={handleSubmit} className="booking-form">
					<label>
						Client Name
						{/* we want to show the client name but not allow editing */}
						<input
							name="clientName"
							value={form.clientName}
							onChange={handleChange}
							required
							disabled
						/>
					</label>

					<div className="date-row">
						<label>
							Start Date &amp; Time
							<input
								name="startDate"
								type="datetime-local"
								value={form.startDate}
								onChange={handleChange}
								required
							/>
						</label>
						<label>
							End Date &amp; Time
							<input
								name="endDate"
								type="datetime-local"
								value={form.endDate}
								onChange={handleChange}
								required
							/>
						</label>
					</div>

					<label>
						Notes <span className="optional">(optional)</span>
						<textarea
							name="notes"
							value={form.notes}
							onChange={handleChange}
							rows={3}
						/>
					</label>

					<div className="modal-actions">
						<button type="button" className="btn-secondary" onClick={onClose}>
							Cancel
						</button>
						<button type="submit" disabled={loading}>
							{loading ? "Saving…" : "Save Changes"}
						</button>
					</div>
				</form>
			</div>
		</div>,
		document.body, // renders directly into <body>, outside the component tree
	)
}
