import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'

import { Home } from '@/pages/Home'
import { Issuer } from '@/pages/Issuer'
import { MyProfile } from '@/pages/MyProfile'
import Landing from './pages/Landing'

function Layout() {
	return (
		<>
			<Outlet />
		</>
	)
}

const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: '/landing',
				element: <Landing />
			},
			{
				path: '/',
				element: <Home />
			},
			{
				path: '/issuer/:issuerAddress',
				element: <Issuer />
			},
			{
				path: '/my-profile',
				element: <MyProfile />
			}
		]
	}
])

function App() {
	return (
		<>
			<RouterProvider router={router} />
		</>
	)
}

export default App
