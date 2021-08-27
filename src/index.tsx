import React from 'react'
import ReactDOM from 'react-dom'
// can't use chota.min.css due to CRA transpilation bug
import 'chota/dist/chota.css'
import './styles/index.css'
import { App } from './App'
import { joinPath } from './utils/path'

fetch(joinPath('build-timestamp.txt')).then(async (res) => {
	const ts = await res.text()

	console.info('App last built', new Date(Number(ts)))
})

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root'),
)
