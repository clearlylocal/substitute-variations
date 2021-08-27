import { FC, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import Excel from 'exceljs'
import { expandToAll, expandToSamples } from '../core/expand'
import { pipeNullable } from '../utils/fns'
import { selectRanges } from '../utils/exceljs'
import { filenameify } from '../utils/formatters'

export const readFile = (file: File) =>
	new Promise<ArrayBuffer>((res) => {
		const reader = new FileReader()

		reader.onload = (e) => res(e.target!.result as ArrayBuffer)

		reader.readAsArrayBuffer(file)
	})

export const writeFile = (
	filename: string,
	buf: BlobPart,
	mimeType: string,
) => {
	const blob = new Blob([buf], {
		type: mimeType,
	})

	const link = document.createElement('a')

	link.href = window.URL.createObjectURL(blob)

	const fileName = filename

	link.download = fileName
	link.click()
}

const expansionTypes = ['full', 'samples'] as const

type FormVals = {
	files?: FileList
	expansionType: typeof expansionTypes[number]
	ranges: string
}

const init: FormVals = {
	expansionType: 'full',
	ranges: '*',
}

export const Convert: FC = () => {
	const defaultValues: FormVals = useMemo(
		() =>
			pipeNullable(localStorage.getItem('convertForm'), JSON.parse) ??
			init,
		[],
	)

	const { register, handleSubmit } = useForm<FormVals>({
		defaultValues,
	})

	const changeHandler = useCallback((form: FormVals) => {
		localStorage.setItem(
			'convertForm',
			JSON.stringify(form, (k, v) =>
				(k as keyof FormVals) === 'files' ? undefined : v,
			),
		)
	}, [])

	const submitHandler = useCallback(async (form: FormVals) => {
		const { files, expansionType } = form

		const expandFn =
			expansionType === 'samples' ? expandToSamples : expandToAll

		if (!files?.length) {
			window.alert('No file selected')

			return
		}

		const file = files[0]
		const data = await readFile(file)

		const workbook = new Excel.Workbook()

		await workbook.xlsx.load(data)

		const ranges = form.ranges.trim()

		if (ranges === '*') {
			workbook.eachSheet((sheet) => {
				sheet.eachRow((row) => {
					row.eachCell((cell) => {
						if (typeof cell.value === 'string')
							cell.value = expandFn(cell.value).join('\n')
					})
				})
			})
		} else {
			try {
				for (const cell of selectRanges(workbook, ranges, /[,\n]/).flat(
					2,
				)) {
					if (typeof cell.value === 'string')
						cell.value = expandFn(cell.value).join('\n')
				}
			} catch (e) {
				window.alert('Invalid ranges')
				console.error(e)

				return
			}
		}

		const buf = await workbook.xlsx.writeBuffer()

		const fileNameSansExt = [
			`${file.name.split('.').slice(0, -1).join('.')}`,
			'expanded',
			expansionType,
			filenameify(new Date()),
		].join('_')

		writeFile(
			`${fileNameSansExt}.xlsx`,
			buf,
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		)
	}, [])

	return (
		<form
			onSubmit={handleSubmit(submitHandler)}
			onChange={handleSubmit(changeHandler)}
		>
			<h1>Convert</h1>
			<div className='spaced'>
				<label>
					Upload file (XLSX)
					<input type='file' name='files' ref={register} />
				</label>
			</div>
			<div className='spaced'>
				<label>
					Expansion type
					<select name='expansionType' ref={register}>
						{expansionTypes.map((t) => (
							<option key={t} value={t}>
								{t}
							</option>
						))}
					</select>
				</label>
			</div>
			<div className='spaced'>
				<label>
					Ranges to include (* = all; comma/newline delimited)
					<textarea name='ranges' ref={register} />
				</label>
			</div>
			<div className='spaced'>
				<button type='submit'>Convert</button>
			</div>
		</form>
	)
}
