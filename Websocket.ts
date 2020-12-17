import WebSocket from "ws";
import Connection from "./Connection";
import Listener from "./Listener";

export default class Server extends Listener<{
	connection: (connection: Connection) => void
	open: () => void
}> {

	private clients: Array<Connection> = []

	public constructor(options: WebSocket.ServerOptions) {
		super()
		const server = new WebSocket.Server(options, () => this.emit('open'))
		server.on('connection', (ws) => {
			const connection = new Connection(ws)
			connection.on('close', () => {
				const index = this.clients.indexOf(connection)
				this.clients.splice(index, 1)
			})
			this.emit('connection', connection)
		})
	}

	public broadcast(message: string) {
		this.clients.forEach((ws) => ws.send(message))
	}
}
