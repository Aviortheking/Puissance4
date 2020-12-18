import WebSocket from "ws";
import Listener from "./Listener";
/**
 *  Creation et Export de la classe Connection hérité de Listener
 */
export default class Connection extends Listener<{
	message: (message: string | Record<string, any>) => void
	close: () => void
}> {
	/**
	 * Creation du constructeur, qui reçoit des messages de type string et qui les transforme en Json si possible
	 *
	 */
	public constructor(
		private ws: WebSocket
	) {
		super()
		ws.on('message', (message) => {
			try {
				this.emit('message', JSON.parse(message.toString()))
			} catch {
				this.emit('message', message.toString())
			}
		})
		ws.once('close', () => {
			this.emit('close')
		})
	}
	/**
	 *
	 * Envoie du message reçu et modifié vers le serveur
	 */
	public send(message: string | Record<string, any>) {
		if (typeof message === 'string') {
			return this.ws.send(message)
		}
		this.ws.send(JSON.stringify(message))
	}
}
