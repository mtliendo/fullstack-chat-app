import { Link } from 'react-router-dom'

const Footer = () => {
	return (
		<footer className="footer footer-center p-4 bg-base-300 text-base-content">
			<aside>
				<p>
					Made with ❤️ by{' '}
					<Link className="link" to="https://focusotter.com">
						Focus Otter
					</Link>{' '}
					🦦
				</p>
			</aside>
		</footer>
	)
}

export default Footer
