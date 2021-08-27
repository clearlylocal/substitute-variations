export function pipe<A>(a: A): A
export function pipe<A, B>(a: A, ab: (a: A) => B): B
export function pipe<A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C): C
export function pipe<A, B, C, D>(
	a: A,
	ab: (a: A) => B,
	bc: (b: B) => C,
	cd: (c: C) => D,
): D
export function pipe<A, B, C, D, E>(
	a: A,
	ab: (a: A) => B,
	bc: (b: B) => C,
	cd: (c: C) => D,
	de: (d: D) => E,
): E
export function pipe<A, B, C, D, E, F>(
	a: A,
	ab: (a: A) => B,
	bc: (b: B) => C,
	cd: (c: C) => D,
	de: (d: D) => E,
	ef: (e: E) => F,
): F
export function pipe(init: any, ...fns: any[]) {
	return fns.reduce((val, fn) => fn(val), init)
}

type Unnullable<T> = Exclude<T, null | undefined>

export function pipeNullable<A>(a: A): A
export function pipeNullable<A, B>(
	a: A,
	ab: (a: Unnullable<A>) => B,
): Unnullable<B>
export function pipeNullable<A, B, C>(
	a: A,
	ab: (a: Unnullable<A>) => B,
	bc: (b: Unnullable<B>) => C,
): Unnullable<C>
export function pipeNullable<A, B, C, D>(
	a: A,
	ab: (a: Unnullable<A>) => B,
	bc: (b: Unnullable<B>) => C,
	cd: (c: Unnullable<C>) => D,
): Unnullable<D>
export function pipeNullable<A, B, C, D, E>(
	a: A,
	ab: (a: Unnullable<A>) => B,
	bc: (b: Unnullable<B>) => C,
	cd: (c: Unnullable<C>) => D,
	de: (d: Unnullable<D>) => E,
): Unnullable<E>
export function pipeNullable<A, B, C, D, E, F>(
	a: A,
	ab: (a: Unnullable<A>) => B,
	bc: (b: Unnullable<B>) => C,
	cd: (c: Unnullable<C>) => D,
	de: (d: Unnullable<D>) => E,
	ef: (e: Unnullable<E>) => F,
): Unnullable<F>
export function pipeNullable(init: any, ...fns: any[]) {
	return fns.reduce((val, fn) => (val == null ? val : fn(val)), init)
}

export const permute = <T>(arr: T[]) => (arrOfArrs: T[][]) =>
	arr.flatMap((x) => arrOfArrs.map((a) => [...a, x]))
