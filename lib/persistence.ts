import fs from "fs"
import path from "path"
import { Store } from "@/types"
import { createStore } from "@/models/store"

//stored in booking-app/data/store.json
const FILE_PATH = path.join(process.cwd(), "data", "store.json")
const STORE_NAME = "My Bookings Store"

function ensureFile(): void {
	const dir = path.dirname(FILE_PATH)
    //check if directory exists, if not, create it 
	if (!fs.existsSync(dir)) 
        fs.mkdirSync(dir, { recursive: true })

    //check if json file exists, if not, create it with initial store data
	if (!fs.existsSync(FILE_PATH)) {
		const initial: Store = createStore(STORE_NAME)
		fs.writeFileSync(FILE_PATH, JSON.stringify(initial, null, 2))
	}
}

export function readStore(): Store {
	ensureFile()
	const raw = fs.readFileSync(FILE_PATH, "utf-8")
	return JSON.parse(raw) as Store
}

export function writeStore(store: Store): void {
	ensureFile()
	fs.writeFileSync(FILE_PATH, JSON.stringify(store, null, 2))
}
