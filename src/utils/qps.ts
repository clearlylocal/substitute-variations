import { JsonSerializable } from '../types'

function initQps<T extends Record<string, JsonSerializable>>() {
	type Key = string & keyof T

	return new Proxy({} as Partial<T>, {
		get(_, k: Key) {
			const url = new URL(window.location.href)

			const raw = url.searchParams.get(k)

			return raw == null ? undefined : JSON.parse(raw)
		},
		set(_, k: Key, v) {
			const url = new URL(window.location.href)

			url.searchParams.set(k, JSON.stringify(v))

			window.history.replaceState({}, document.title, url.href)

			return true
		},
		deleteProperty(_, k: Key) {
			const url = new URL(window.location.href)

			url.searchParams.delete(k)

			window.history.replaceState({}, document.title, url.href)

			return true
		},
	})
}

export const qps = initQps<{
	input: string
}>()
