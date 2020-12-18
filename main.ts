import express from 'express'
import WebSocket from './Websocket'
import Connection from './Connection'

/**
 * Création de l'interface Comm
 */
interface Comm {
	type?: 'request' | 'join' | 'proxy'
	id?: number
	xPos?: number
	continue?: boolean
}
/**
 * Mise en place du framework express
 */
const app = express();

app.use(express.static('public'))
/**
 * Création du serveur
 */
var server = app.listen(3000, function () {

	const wsServer = new WebSocket({ port: 8080 })
	/**
	 *Lecture des différents messages reçu en fonctions de leurs types
	 */
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

			if (message?.type === 'proxy' && typeof message.xPos === 'number' && message?.id) {
				proxyRequest(conn, message.id, message.xPos)
			}

			if (message?.type === 'proxy' && typeof message.xPos === 'number' && message?.id) {
				proxyRequest(conn, message.id, message.xPos)
			}

			if (message?.type === 'proxy' && message.continue && message?.id) {
				proxyContinue(conn, message.id)
			}

		})
	})

	console.log(`Example app listening at http://localhost:3000`);
});

const currentSessions: Array<Array<Connection>> = []

/**
 *
 * Création de session de jeu et identification de celle ci par un code
 */
function handleRequest(conn: Connection) {
	// Générer un nombre aléatoire entre 100 et 999 et on vérifie qu'il n'y a pas déja de parti avec cette ID
	let n: number
	do {
		n = getRandomInt(100, 999)
	} while (currentSessions[n] !== undefined);

	// Rajouter la connection a cette partie
	joinSession(conn, n)
}

/**
 *
 * Cette fonction permet de joindre une session créer par handleRequest
 *
 *
 */
function joinSession(conn: Connection, session: number) {
	// Rajouter la connection a cette partie
	if (!currentSessions[session]) {
		currentSessions[session] = []
	}
	if (currentSessions[session].length >= 2) {
		return conn.send({ joined: false, reason: 'lobby full' })
	}
	currentSessions[session].push(conn)
	conn.once('close', () => {
		console.log('closing session')
		const index = currentSessions[session].indexOf(conn)
		currentSessions[session].splice(index, 1)
		currentSessions[session].forEach((c) => c.send(JSON.stringify({ gameStopped: true })))
		if (currentSessions[session].length === 0) {
			delete currentSessions[session]
		}
	})
	// renvoie au client l'ID
	conn.send({ sessionId: session, joined: true })

	if (currentSessions[session].length === 2) {
		for (const connection of currentSessions[session]) {
			connection.send({ gameStarted: true, startGame: connection !== conn })
		}
	}
}
/**
 * Permet d'envoyer le mouvement fait par le joueur actif
 */
function proxyRequest(conn: Connection, session: number, xPos: number) {
	// Renvoyer a tout les clients du meme ID le xPos
	for (const connection of currentSessions[session]) {
		if (conn === connection) {
			continue
		}
		connection.send({ xPos })
	}
}

/**
 * Création de la nouvelle manche, sans redémarrer la partie
 *
 */
function proxyContinue(conn: Connection, session: number) {
	// Renvoyer a tout les clients du meme ID le xPos
	for (const connection of currentSessions[session]) {
		if (conn === connection) {
			continue
		}
		connection.send({ continue: true })
	}
}
/**
 *Création d'un chiffre aléatoire
 */
function getRandomInt(min: number, max: number) {
	return Math.floor(Math.random() * ((max + 1) - min)) + min
}
