import { FormEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Schema } from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import clsx from 'clsx'
import { useAuthenticator } from '@aws-amplify/ui-react'

const client = generateClient<Schema>()

const MessagePage = () => {
	const { user } = useAuthenticator((context) => [context.user])

	const { roomName } = useParams()
	const [roomDetails, setRoomDetails] = useState<{
		roomId: string
		name: string
	}>()
	const [msgText, setMsgText] = useState('')
	const [msgs, setMsgs] = useState<Schema['Message']['type'][]>([])

	useEffect(() => {
		const sub = client.models.Message.onCreate().subscribe({
			next: (data) => setMsgs((prev) => [...prev, { ...data }]),
			error: (error) => console.warn(error),
		})
		return () => sub.unsubscribe()
	}, [])
	useEffect(() => {
		if (!roomName) return
		console.log('the room url name', roomName)
		client.models.Room.listRoomByUrlName(
			{ urlName: roomName },
			{
				selectionSet: ['id', 'name', 'messages.*'],
			}
		).then(({ data }) => {
			console.log('the data', data)
			setMsgs(data[0].messages)
			setRoomDetails({
				roomId: data[0].id,
				name: data[0].name,
			})
		})
	}, [roomName])

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()

		const { data: newMessage } = await client.models.Message.create({
			roomId: roomDetails?.roomId as string,
			content: msgText,
		})

		if (!newMessage) return

		setMsgs((prev) => [...prev, { ...newMessage }])
		setMsgText('')
	}
	return (
		<div className="flex flex-col h-[85vh]">
			<div className="flex-1 overflow-y-auto p-6 space-y-4">
				{msgs.map((msg) => (
					<div
						key={msg.id}
						className={clsx(
							'w-full flex',
							msg.owner !== user.username ? 'justify-start' : 'justify-end'
						)}
					>
						<div
							className={clsx(
								'chat max-w-xl w-1/3',
								msg.owner !== user.username ? 'chat-start' : 'chat-end'
							)}
						>
							<p
								className={clsx(
									'chat-bubble',
									msg.owner !== user.username
										? 'chat-bubble-accent'
										: 'chat-bubble-info'
								)}
							>
								{msg.content}
							</p>
						</div>
					</div>
				))}
			</div>
			<form
				onSubmit={handleSubmit}
				className="bg-info py-4 px-6 flex items-center"
			>
				<input
					className="flex-1 input"
					placeholder="Type your message..."
					type="text"
					value={msgText}
					onChange={(e) => setMsgText(e.target.value)}
				/>
				<button type="submit" className="btn btn-secondary ml-4">
					Send
				</button>
			</form>
		</div>
	)
}

export default MessagePage
