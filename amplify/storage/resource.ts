import { defineStorage } from '@aws-amplify/backend'

export const storage = defineStorage({
	name: 'chatpics',
	access: (allow) => ({
		'chat-pics/*': [allow.authenticated.to(['read', 'write'])],
	}),
})
