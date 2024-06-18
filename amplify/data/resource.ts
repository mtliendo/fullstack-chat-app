import { type ClientSchema, a, defineData } from '@aws-amplify/backend'

const schema = a.schema({
	Room: a
		.model({
			name: a.string().required(),
			urlName: a.string().required(),
			messages: a.hasMany('Message', 'roomId'),
		})
		.secondaryIndexes((index) => [index('urlName')])
		.authorization((allow) => [allow.authenticated().to(['create', 'read'])]),
	Message: a
		.model({
			roomId: a.id().required(),
			type: a.enum(['text', 'image']),
			content: a.string(),
			picId: a.string(),
			room: a.belongsTo('Room', 'roomId'),
			userNickname: a.string().required(),
		})
		.authorization((allow) => [
			allow.owner().to(['read', 'create']),
			allow.authenticated().to(['read']),
		]),
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
	name: 'fullstack-chat',
	schema,
	authorizationModes: {
		defaultAuthorizationMode: 'userPool',
	},
})
