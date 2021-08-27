import { FC, useEffect, useMemo, useState } from 'react'
import { expandToSamples, expandToAll } from '../core/expand'
import { qps } from '../utils/qps'

const init = `[Turn on/Switch on/Enable/Activate] [the/] driver['s seat/] fan [mode/].
[Turn/Switch] [the/] driver['s seat/] fan on.`

export const Preview: FC = () => {
	const [input, setInput] = useState(
		qps.input ?? localStorage.previewInput ?? init,
	)

	useEffect(() => {
		if (input === init) {
			delete qps.input
			delete localStorage.previewInput
		} else {
			qps.input = localStorage.previewInput = input
		}
	}, [input])

	const [full, samples] = useMemo(
		() =>
			[expandToAll(input), expandToSamples(input)].map((x) =>
				x.join('\n'),
			),
		[input],
	)

	return (
		<>
			<div>
				<h1>Preview</h1>
				<textarea
					className='spaced'
					rows={5}
					cols={70}
					value={input}
					onChange={({ currentTarget: { value } }) => {
						setInput(value)
					}}
				/>
				<button
					className='button primary'
					onClick={() => {
						if (window.confirm('Reset input to default example?')) {
							setInput(init)
						}
					}}
				>
					Reset
				</button>
			</div>
			<div>
				<h2>Sample variations</h2>
				<div className='pre-wrap'>{samples}</div>
			</div>
			<div>
				<h2>Full list</h2>
				<div className='pre-wrap'>{full}</div>
			</div>
		</>
	)
}
