import express from 'express'
import WebSocket from './Websocket'
import Connection from './Connection'

interface Comm {
	type?: 'request' | 'join' | 'proxy'
	id?: number
	xPos?: number
}

const app = express();

app.use(express.static('public'))

var server = app.listen(3000, function () {

	const wsServer = new WebSocket({ port: 8080 })

	wsServer.on('connection', (conn) => {
		conn.send({ ok: true })
		conn.on('message', (message: Comm | string) => {
			if (typeof message === 'string') {
				return
			}

			if (message?.type === 'request') {
				handleRequest(conn)
			}

			if (message?.type === 'join' && message?.id) {
				joinSession(conn, message.id)
			}

			if (message?.type === 'proxy' && message?.xPos) {
				proxyRequest(conn, message.xPos)
			}
		})
	})

	console.log(`Example app listening at http://localhost:3000`);
});

function handleRequest(conn: Connection) {
	// Générer un nombre aléatoire entre 100 et 999 et on vérifie qu'il n'y a pas déja de parti avec cette ID

	// Rajouter la connection a cette partie

	// renvoie au client l'ID
}

function joinSession(conn: Connection, session: number) {
	// Rajouter la connection a cette partie

	// renvoie au client l'ID

}

function proxyRequest(conn: Connection, xPos: number) {
	// renvoyer a tout les clients du meme ID le xPos
}
