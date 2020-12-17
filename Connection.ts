import WebSocket from "ws";
import Listener from "./Listener";

export default class Connection extends Listener<{
	message: (message: string | Record<string, any>) => void
}> {
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
	}

	public send(message: string | Record<string, any>) {
		if (typeof message === 'string') {
			return this.ws.send(message)
		}
		this.ws.send(JSON.stringify(message))
	}
}
