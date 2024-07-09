import { FormEvent, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Schema } from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import clsx from 'clsx'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { uploadData } from 'aws-amplify/storage'
import { StorageImage } from '@aws-amplify/ui-react-storage'
import { fetchAuthSession } from 'aws-amplify/auth'

const client = generateClient<Schema>()

function formatTime(dateString: string): string {
	const date = new Date(dateString)

	// Create an Intl.DateTimeFormat object with the desired options
	const formatter = new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true, // Use 24-hour format. Set to true if you want 12-hour format with AM/PM.
	})

	// Format the date object
	const formattedTime = formatter.format(date)

	return formattedTime
}

const MessagePage = () => {
	const { user } = useAuthenticator((context) => [context.user])
	const [userNickname, setUserNickname] = useState('')
	const { roomName } = useParams()
	const fileInputRef = useRef<HTMLInputElement | null>(null)

	const [roomDetails, setRoomDetails] = useState<{
		roomId: string
		name: string
	}>()
	const [msgText, setMsgText] = useState('')
	const [msgFile, setMsgFile] = useState<File | null>(null)
	const [msgs, setMsgs] = useState<Schema['Message']['type'][]>([])

	useEffect(() => {
		const sub = client.models.Message.onCreate().subscribe({
			next: (data) => {
				//update the state if its not my message
				data.owner !== user.username &&
					setMsgs((prev) => [...prev, { ...data }])
			},
			error: (error) => console.warn(error),
		})
		return () => sub.unsubscribe()
	}, [user.username])

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
			//sort messages by 'createdAt' field
			data[0].messages.sort(
				(a, b) =>
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
			)
			setMsgs(data[0].messages as Schema['Message']['type'][])
			setRoomDetails({
				roomId: data[0].id,
				name: data[0].name,
			})
		})
	}, [roomName])

	useEffect(() => {
		fetchAuthSession().then((user2) => {
			console.log(user2.tokens?.idToken?.payload['nickname'])
			setUserNickname(user2.tokens?.idToken?.payload['nickname'] as string)
		})
	}, [])

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()

		if (msgText) {
			const { data: newMessage } = await client.models.Message.create({
				roomId: roomDetails?.roomId as string,
				type: 'text',
				content: msgText,
				userNickname,
			})
			setMsgs(
				(prev) => [...prev, { ...newMessage }] as Schema['Message']['type'][]
			)
			setMsgText('')
			console.log('nothing', newMessage)
		}

		if (msgFile) {
			const uploadedItem = await uploadData({
				data: msgFile,
				path: `chat-pics/${msgFile.name}`,
			}).result

			console.log('the uploaded item', uploadedItem)
			const { data: newMessage } = await client.models.Message.create({
				roomId: roomDetails?.roomId as string,
				type: 'image',
				picId: uploadedItem.path,
				userNickname,
			})

			setMsgs(
				(prev) => [...prev, { ...newMessage }] as Schema['Message']['type'][]
			)
			setMsgFile(null)
			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}
		}
	}
	return (
		<div className="flex flex-col h-screen">
			<div className="flex-1 overflow-y-auto p-6 space-y-4">
				{msgs.map((msg) => (
					<div
						key={msg.id}
						className={clsx(
							'w-full flex',
							msg.owner !== user.username ? 'justify-start' : 'justify-end'
						)}
					>
						{msg.content && (
							<div
								className={clsx(
									'chat max-w-xl w-1/3',
									msg.owner !== user.username ? 'chat-start' : 'chat-end'
								)}
							>
								<div className="chat-header">
									{msg.userNickname}
									<time className="text-xs opacity-50">
										{' '}
										{formatTime(msg.createdAt)}
									</time>
								</div>
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
						)}
						{msg.picId && (
							<div
								className={clsx(
									'chat max-w-xl w-1/3',
									msg.owner !== user.username ? 'chat-start' : 'chat-end'
								)}
							>
								<div className="chat-header">
									{userNickname}
									<time className="text-xs opacity-50">
										{' '}
										{formatTime(msg.createdAt)}
									</time>
								</div>
								<StorageImage
									path={msg.picId}
									alt=""
									className={clsx(
										'chat-bubble',
										msg.owner !== user.username
											? 'chat-bubble-accent'
											: 'chat-bubble-info'
									)}
								/>
							</div>
						)}
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
				<input
					type="file"
					ref={fileInputRef}
					onChange={(e) => e.target.files && setMsgFile(e.target.files[0])}
					className="file-input file-input-bordered file-input-primary w-full max-w-xs mx-4"
				/>
				<button type="submit" className="btn btn-secondary">
					Send
				</button>
			</form>
		</div>
	)
}

export default MessagePage
