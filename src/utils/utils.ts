export const hashWithDefault = <T>(defaultVal: T) =>
	new Proxy({} as Record<string, T>, {
		get(target, key: string) {
			return target.hasOwnProperty(key) ? target[key] : defaultVal
		},
	})
