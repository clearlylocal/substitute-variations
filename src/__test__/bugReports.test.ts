import { concat } from '../concatSubtitles'
import { bugReports } from './fixtures/bugReports'

const truncate = (len: number) => (str: string) =>
	str.slice(0, len) + (str.length > len ? '...' : '')
const fmt = (src: any) =>
	truncate(30)(JSON.stringify(src, null, '\t').replace(/[\t\n]+/g, ' '))

const TS = '00:00:00:00'

for (const { date, cases } of bugReports) {
	describe(date, () => {
		for (const { source, expected } of cases) {
			it(truncate(100)(`${fmt(source)} => ${fmt(expected)}`), () => {
				const result = concat({ customWords: 'I'.split(',') })(
					source.map((chunk) => [TS, TS, chunk]),
				).map(({ sentence }) => sentence)

				expect(result).toStrictEqual(expected)
			})
		}
	})
}
