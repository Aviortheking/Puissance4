import WebSocket from "ws";
import Connection from "./Connection";
import Listener from "./Listener";

/**
 *  Creation et export de la class Server hérité de Listener
 *
 */
export default class Server extends Listener<{
	connection: (connection: Connection) => void
	open: () => void
}> {

	private server: WebSocket.Server

	/**
	 * 	Créer un serveur WebSocket
	 * 	Ecoute les emissions lors de l'ouverture d'une connection
	 *	émet l'information de nouvelle connection lors d'une nouvelle connection
	 */
	public constructor(options: WebSocket.ServerOptions) {
		super()
		const server = new WebSocket.Server(options, () => this.emit('open'))
		server.on('connection', (ws) => {
			const connection = new Connection(ws)
			this.emit('connection', connection)
		})
		this.server = server
	}

	/**
	 * Permet d'envoyer un message à tout les serveurs reliés
	 */
	public broadcast(message: string) {
		this.server.clients.forEach((ws) => ws.send(message))
	}
}
