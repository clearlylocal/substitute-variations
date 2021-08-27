import { pipe, permute } from '../utils/fns'

const inputToLines = (text: string) =>
	text
		.trim()
		.split('\n')
		.map((x) => x.trim())

const segmentsToLine = (segments: string[]) =>
	segments
		.join('')
		.replace(/ +/g, ' ')
		.replace(/ ([.,?!;:])/g, '$1')
		.trim()

const segmentSplitter = /\[([^\]]+)\]/

const uniq = <T>(arr: T[]) => [...new Set(arr)]

const expand = (line: string) => {
	const split = line.split(segmentSplitter)

	const all = split
		.reduce(
			(acc, cur, idx) => {
				return idx % 2 === 0
					? acc.map((x) => [...x, cur])
					: pipe(acc, permute(cur.split('/')))
			},
			[['']],
		)
		.map(segmentsToLine)

	return uniq(all)
}

export const expandToAll = (text: string) =>
	inputToLines(text).flatMap((line) => uniq(expand(line)))

export const expandToSamples = (text: string) => {
	const lineSegments = inputToLines(text).map((line) =>
		line
			.split(segmentSplitter)
			.map((seg, i) => (i % 2 ? seg.split('/') : seg)),
	)

	const out: string[][] = []

	for (const line of lineSegments) {
		const max = Math.max(
			1, // at least one - if no [alternatives/] in a line
			...line.filter((_, i) => i % 2).map((x) => x.length),
		)

		out.push(
			[...new Array(max)]
				.map((_, i) => i)
				.map((inc) =>
					line.map((seg, segIdx) =>
						segIdx % 2 ? seg[inc % seg.length] : seg,
					),
				)
				.map(
					segmentsToLine as (
						...args: any[]
					) => ReturnType<typeof segmentsToLine>,
				),
		)
	}

	return uniq(out.flat())
}
