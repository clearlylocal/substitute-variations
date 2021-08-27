import { join } from 'path'

export const joinPath = (...segments: string[]) =>
	join(process.env.PUBLIC_URL, ...segments.flat())
