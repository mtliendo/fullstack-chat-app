import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Schema } from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/api'

const client = generateClient<Schema>()
const RoomsPage = () => {
	const [rooms, setRooms] = useState<Schema['Room']['type'][]>([])
	const [roomName, setRoomName] = useState('')
	const navigate = useNavigate()
	useEffect(() => {
		client.models.Room.list().then((rooms) => {
			setRooms(rooms.data)
		})
	}, [])

	const handleCreateRoomSubmit = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault()
		const urlName = roomName.toLowerCase().replace(/\s/g, '-')
		const { data: createdRoom } = await client.models.Room.create({
			name: roomName,
			urlName,
		})
		setRoomName('')

		setRooms([...rooms, createdRoom] as Schema['Room']['type'][])
		navigate(`/rooms/${urlName}`)
	}
	return (
		<>
			<h1 className="text-3xl text-center mt-12">Public Chat Rooms</h1>
			<div className="my-8 w-full">
				<div className="flex flex-col items-center">
					<form onSubmit={handleCreateRoomSubmit}>
						<input
							className="input input-md input-primary mr-2"
							placeholder="my cool room name"
							value={roomName}
							required
							onChange={(e) => {
								setRoomName(e.target.value)
							}}
						/>
						<button type="submit" className="btn btn-secondary">
							{' '}
							Create Room
						</button>
					</form>
				</div>
			</div>
			<section>
				{rooms.map((room) => (
					<article
						key={room.id}
						className="bg-accent rounded flex flex-col max-w-screen-md mx-auto p-4"
					>
						<Link
							className="text-2xl text-primary-content"
							to={`/rooms/${room.urlName}`}
						>
							<div className="h-24 flex justify-center items-center">
								{room.name}
							</div>
						</Link>
					</article>
				))}
			</section>
		</>
	)
}

export default RoomsPage
