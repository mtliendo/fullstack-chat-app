import { Authenticator } from '@aws-amplify/ui-react'

import { Outlet } from 'react-router-dom'
const formFields = {
	signUp: {
		email: {
			order: 1,
		},
		nickname: {
			placeholder: 'Enter your Chat Name',
			isRequired: true,
			label: 'Chat Name',
			order: 2,
		},
		password: {
			order: 3,
		},
		confirm_password: {
			order: 4,
		},
	},
}
export default function ProtectedLayout() {
	return (
		<Authenticator formFields={formFields} className="h-full flex items-center">
			<Outlet />
		</Authenticator>
	)
}
