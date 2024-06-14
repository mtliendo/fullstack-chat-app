import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Schema } from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/api'

const client = generateClient<Schema>()
const RoomsPage = () => {
	const [rooms, setRooms] = useState<Schema['Room']['type'][]>([])
	useEffect(() => {
		client.models.Room.list().then((rooms) => {
			setRooms(rooms.data)
		})
	}, [])
	return (
		<>
			<h1 className="text-3xl text-center mt-12">Public Chat Rooms</h1>
			<div className="my-8 w-full">
				<div className="flex flex-col items-center">
					<input
						className="input input-md input-primary"
						placeholder="Search..."
					/>
					<div className="mt-4">
						<p>
							Not finding what you're looking for?{' '}
							<Link className="link" to="create">
								Create a new room!
							</Link>
						</p>
					</div>
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
