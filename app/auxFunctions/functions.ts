//small functions to be used across the entire app

//converts an ISO date string to a format that can be used in a datetime-local input
export function toDateTimeLocal(iso: string): string {
	const d = new Date(iso)
	const yyyy = d.getFullYear()
	const mm = String(d.getMonth() + 1).padStart(2, "0")
	const dd = String(d.getDate()).padStart(2, "0")
	const hour = String(d.getHours()).padStart(2, "0")
	const minute = String(d.getMinutes()).padStart(2, "0")
	return `${yyyy}-${mm}-${dd}T${hour}:${minute}`
}