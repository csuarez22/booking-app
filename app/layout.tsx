import type { Metadata } from "next"
import { Toaster } from "sonner"

import "./globals.css"

export const metadata: Metadata = {
	title: "Store Booking Manager",
	description: "Book appointments at your store",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				{children}
				<Toaster position="bottom-right" />
			</body>
		</html>
	)
}
