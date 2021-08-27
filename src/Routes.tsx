import { FC } from 'react'
import { Preview } from './pages/Preview'
import { Switch, Route } from 'react-router-dom'
import { Convert } from './pages/Convert'
import { Instructions } from './pages/Instructions'

export const Routes: FC = () => {
	return (
		<Switch>
			<Route exact path='/'>
				<Preview />
			</Route>
			<Route path='/convert'>
				<Convert />
			</Route>
			<Route path='/instructions'>
				<Instructions />
			</Route>
		</Switch>
	)
}
