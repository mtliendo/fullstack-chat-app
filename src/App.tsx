import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Authenticator } from '@aws-amplify/ui-react'
import RootLayout from './layouts/RootLayout'
import ProtectedLayout from './layouts/ProtectedLayout'
import HomePage from './pages/HomePage'
import RoomsPage from './pages/RoomsPage'
import MessagePage from './pages/MessagePage'

const router = createBrowserRouter([
	{
		element: <RootLayout />,
		children: [
			{
				path: '/',
				element: <HomePage />,
			},
			{
				element: <ProtectedLayout />,
				path: 'rooms',
				children: [
					{
						path: '/rooms',
						element: <RoomsPage />,
					},
					{
						path: '/rooms/:roomName',
						element: <MessagePage />,
					},
				],
			},
		],
	},
])

function App() {
	return (
		<Authenticator.Provider>
			<RouterProvider router={router} />
		</Authenticator.Provider>
	)
}

export default App
