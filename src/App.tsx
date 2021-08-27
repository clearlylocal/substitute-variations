import { FC } from 'react'
import { BrowserRouter as Router, NavLink } from 'react-router-dom'
import { Routes } from './Routes'

export const App: FC = () => {
	return (
		<>
			<Router basename={process.env.PUBLIC_URL}>
				<nav className='tabs'>
					<NavLink exact activeClassName='active' to='/'>
						Preview
					</NavLink>
					<NavLink activeClassName='active' to='/convert'>
						Convert
					</NavLink>
					<NavLink activeClassName='active' to='/instructions'>
						Instructions
					</NavLink>
				</nav>
				<main className='container'>
					<Routes />
				</main>
			</Router>
		</>
	)
}
