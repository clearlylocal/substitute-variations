import Excel from 'exceljs'
import { regex, unwrap } from 'fancy-regex'

const matchers = (() => {
	const disallowedInSheetName = regex`
		[^
			:\\/?*\[\]    # disallowed
			\x00-\x1f\x7f # control chars
			'!:,          # delimiters
		]
	`

	const escapedSheetRef = regex`'${disallowedInSheetName}+'`

	const sheetRef = regex`
		${disallowedInSheetName}+
		| ${escapedSheetRef}
	`

	const colRef = regex`[a-zA-Z]+`
	const rowRef = regex`\d+`

	const cellRefFullyQualified = regex`
		(?:${colRef})
		(?:${rowRef})
	`

	const cellRefStandalone = regex`
		^
			(?<col>${colRef})
			(?<row>${rowRef})?
		$
	`

	const rangeRefCellsOnly = regex`
		^
			(?:${cellRefFullyQualified}:${cellRefFullyQualified})
			| (?:${colRef}:${colRef})
		$
	`

	const rangeRefStandalone = regex`
		(?:
			(?<sheet>${sheetRef})
			!
		)?
		(?<cells>
			${unwrap(rangeRefCellsOnly)}
		)
	`

	return {
		cellRefStandalone,
		rangeRefStandalone,
		rangeRefCellsOnly,
		escapedSheetRef,
	}
})()

const toColAndRow = (cellRef: string) => {
	const { col, row } = cellRef.match(matchers.cellRefStandalone)?.groups ?? {}

	if (!col) {
		throw new Error('Invalid cell reference')
	}

	return [col, row ? Number(row) : -1] as const
}

// modified from https://github.com/exceljs/exceljs/issues/416#issuecomment-565097379
export const selectRange = (sheet: Excel.Worksheet, range: string) => {
	const matches = matchers.rangeRefCellsOnly.test(range)

	if (!matches) throw new Error('Invalid range')

	const [startCell, endCell] = range.split(':', 2)

	const [[startCellColumn, startRow], [endCellColumn, endRow]] = [
		startCell,
		endCell,
	].map(toColAndRow)

	if (startRow * endRow < 0 /* only one is -1 */)
		throw new Error('Invalid range')

	let _endColumn = sheet.getColumn(endCellColumn)
	let _startColumn = sheet.getColumn(startCellColumn)

	if (!_endColumn) throw new Error('End column not found')
	if (!_startColumn) throw new Error('Start column not found')

	const endColumn = _endColumn.number
	const startColumn = _startColumn.number

	const cells: Excel.Cell[][] = []

	if (startRow === -1) {
		for (let colNum = startColumn; colNum <= endColumn; colNum++) {
			sheet.getColumn(colNum).eachCell((cell, rowNumber) => {
				cells[rowNumber - 1] ??= []

				cells[rowNumber - 1].push(cell)
			})
		}
	} else {
		for (let rowNum = startRow; rowNum <= endRow; rowNum++) {
			const row = sheet.getRow(rowNum)

			cells.push([])

			for (let colNum = startColumn; colNum <= endColumn; colNum++) {
				cells[cells.length - 1].push(row.getCell(colNum))
			}
		}
	}

	return cells
}

export const selectRanges = (
	workbook: Excel.Workbook,
	range: string,
	delim: string | RegExp = ',',
) => {
	const out: Excel.Cell[][][] = []

	range
		.split(delim)
		.map((x) => x.trim())
		.forEach((x) => {
			const { sheet: sheetName, cells } =
				x.match(matchers.rangeRefStandalone)?.groups ?? {}

			if (sheetName) {
				const sheet = workbook.getWorksheet(
					matchers.escapedSheetRef.test(sheetName)
						? sheetName.slice(1, -1)
						: sheetName,
				)

				if (sheet) out.push(selectRange(sheet, cells))
			} else {
				workbook.eachSheet((sheet) =>
					out.push(selectRange(sheet, cells)),
				)
			}
		})

	return out
}
