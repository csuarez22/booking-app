"use client"

import { useState } from "react"
import { Booking } from "@/types"
import { toast } from "sonner"

interface Props {
	storeName: string
	onBooked: (booking: Booking) => void
}

export default function BookingForm({ storeName, onBooked }: Props) {
	const [form, setForm] = useState({
		clientName: "",
		startDate: "",
		endDate: "",
		notes: "",
	})
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setLoading(true)

		const res = await fetch("/api/bookings", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				clientName: form.clientName,
				storeName,
				startDate: new Date(form.startDate).toISOString(),
				endDate: new Date(form.endDate).toISOString(),
				notes: form.notes || null,
			}),
		})

		const data = await res.json()
		setLoading(false)

		if (!res.ok) {
            toast.error(data.error ?? "Something went wrong.")
			setError(data.error ?? "Something went wrong.")
		} else {
            toast.success("Booking created successfully.");
			onBooked(data as Booking)
			setForm({ clientName: "", startDate: "", endDate: "", notes: "" })
		}
	}

	return (
		<form onSubmit={handleSubmit} className="booking-form">
			<h2>New Booking</h2>

			<label>
				Client Name
				<input
					name="clientName"
					value={form.clientName}
					onChange={handleChange}
					placeholder="Jane Doe"
					required
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
					placeholder="Any special requests..."
					rows={3}
				/>
			</label>

			{error && <p className="error">{error}</p>}

			<button type="submit" disabled={loading}>
				{loading ? "Booking…" : "Confirm Booking"}
			</button>
		</form>
	)
}
