import { useAuthenticator } from '@aws-amplify/ui-react'
import { fetchAuthSession } from 'aws-amplify/auth'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
	const { user, signOut } = useAuthenticator((context) => [context.user])
	const [fetchedUserNickname, setFetchedUserNickname] = useState('')

	useEffect(() => {
		fetchAuthSession().then((user2) => {
			setFetchedUserNickname(user2.tokens?.idToken?.payload.nickname as string)
		})
	}, [])
	return (
		<div className="navbar bg-primary text-primary-content justify-center">
			<div className="">
				<Link to="/" className="btn btn-ghost text-xl">
					FO Chat
				</Link>
			</div>
			<div className="flex-1">
				<p className=" w-full text-center">Welcome {fetchedUserNickname}</p>
			</div>
			<div>
				<ul className="menu menu-horizontal px-1">
					<li>
						<Link to="/rooms">Chat Rooms</Link>
					</li>

					{user && (
						<li>
							<button onClick={signOut}>Sign Out</button>
						</li>
					)}
				</ul>
			</div>
		</div>
	)
}

export default Navbar
