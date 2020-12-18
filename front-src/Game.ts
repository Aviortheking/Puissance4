import { DOMElement, DOMFleetManager } from '@dzeio/dom-manager'
import { textChangeRangeIsUnchanged } from 'typescript'

/**
 * Création et export de la classe game
 */
export default class Game {

	private pointsJ1 = 0
	private pointsJ2 = 0
	public onReset?: () => void
	public onMultiStart?: () => void
	public multiplayerSessionId?: number
	public isWaitingForPlayerMove = false
	public playerColor: 'red' | 'yellow' = 'red'
	public gameType: 'single' | 'multi' = 'single'
	public onWin?: (color?: 'red' | 'yellow') => void

	private table: DOMElement<HTMLTableElement>
	private columns: Array<Array<DOMElement>> = []

	private gameStarted = false
	private ws?: WebSocket

	/**
	 * Création du constructeur permettant de créer le tableau de jeu
	 */
	public constructor(
		table: HTMLTableElement,
		rows: number = 6,
		cols: number = 7
	) {
		this.table = new DOMElement(table)
		for (let i = 0; i < rows; i++) {
			const row = new DOMElement('tr')
			for (let j = 0; j < cols; j++) {
				row.item.appendChild(new DOMElement('td').item)
			}
			row.place('asChildOf', this.table)
		}
		this.setupGeneral()
	}
	/**
	 * Mise en place du tableau, et de différents attributs nécessaires
	 */
	public setupGeneral() {
		// Clear la table
		this.columns = []
		const rows = new DOMFleetManager('tr', this.table)
		rows.each((item, rowIndex) => {
			const cells = new DOMFleetManager('td', item)
			// cellIndex = 0-6
			cells.each((cell, cellIndex) => {
				if (this.columns.length <= cellIndex) {
					this.columns.push([])
				}
				this.columns[cellIndex].push(cell)

				cell
					.text(' ')
					.data('color', null)
					.data('winner', null)
				if (cell.data('event-added') === null) {
					cell.on('click', () => {
						if (this.gameStarted) {
							this.onPlayerMove(cell, cellIndex)
						}
					})
					cell.data('event-added', 'true')
				}

				// Put each cells in the corresponding column


			})
			console.log(this.columns)
		})

		// Setup la base du jeux
	}
	/**
	 * Remise a zéro du jeu lors d'un redemarrage de partie
	 */
	public resetGame() {
		this.cleanMultiplayer()
		if (this.onReset) {
			this.onReset()
		}

		this.pointsJ1 = 0
		this.pointsJ2 = 0
		this.updatePoints()

		this.gameStarted = false
		this.clearTable()
	}

	/**
	  * Remise a zéro du plateau de jeu lors d'un redemarrage de partie
	  */
	public clearTable() {
		const rows = new DOMFleetManager('tr', this.table)
		rows.each((item, rowIndex) => {
			const cells = new DOMFleetManager('td', item)
			// cellIndex = 0-6
			cells.each((cell, cellIndex) => {
				cell
					.text(' ')
					.data('color', null)
					.data('winner', null)
			})
		})
	}
	/**
	 * Lancement d'une partie en joueur vs ia
	 */
	public startSinglePlayer() {
		this.gameStarted = true
		this.gameType = 'single'
		this.setPlayerTurn(true)
	}
	/**
	 *
	 * Gestion des différentes requetes en fonction des actions de l'utilisateur
	 */
	public onWebSocket = (event: MessageEvent) => {
		const json = JSON.parse(event.data)
		if ('joined' in json && json.joined === true) {
			this.multiplayerSessionId = json.sessionId
		}
		if ('xPos' in json && !this.isWaitingForPlayerMove) {
			this.makeMove(json.xPos, this.getEnnemyColor())
			this.setPlayerTurn(true)
		}
		if ('gameStarted' in json) {
			console.log('Game Started in multiplayer')
			if (this.onMultiStart) {
				this.onMultiStart()
			}
			this.gameType = 'multi'
			this.gameStarted = true
			this.isWaitingForPlayerMove = json.startGame
		}
		if ('gameStopped' in json) {
			console.log('The other player has left the session')
			this.resetGame()
		}
		if ('continue' in json) {
			this.continueGame()
		}
	}

	/**
	 * Fermeture d'une session multijoueur
	 */
	public cleanMultiplayer() {
		this.ws?.close()
	}
	/**
	 * Création d'une session multijoueur
	 */

	public setupMultiplayer() {
		this.ws = new WebSocket(`ws://${window.location.hostname}:8080`)
		this.ws.onmessage = this.onWebSocket
	}

	/**
	 * Création d'une partie multijoueur
	 */
	public createMultiplayerGame() {
		if (!this.ws) {
			throw new Error('WebSocket Error')
		}
		this.ws.send(JSON.stringify({ type: 'request' }))
		return new Promise<number>((res, rej) => {
			setTimeout(() => {
				if (!this.multiplayerSessionId) {
					return
				}
				res(this.multiplayerSessionId)
			}, 100)
		})
	}

	/**
	 *
	 * Cette fonction permet de rejoindre la partie créer par un utilisateur
	 */

	public joinMultiplayerGame(sessionId: number) {
		if (!this.ws) {
			throw new Error('WebSocket Error')
		}
		this.ws.send(JSON.stringify({ type: 'join', id: sessionId }))
	}
	/**
	 * Attribution des couleurs
	 */
	private getEnnemyColor() {
		return this.playerColor === 'red' ? 'yellow' : 'red'
	}

	/**
	 * Gestion du tour du joueur
	 */
	public setPlayerTurn(player: boolean) {
		const playerShower = DOMElement.get('.playerColor')
		if (!playerShower) {
			return
		}
		playerShower.text(player ? this.playerColor : this.getEnnemyColor())
		if (player) {
			this.isWaitingForPlayerMove = true
		} else {
			if (this.gameType === 'single' && this.gameStarted) {
				setTimeout(() => {
					this.makeIATakeTurn()
					this.setPlayerTurn(true)
				}, getRandomInt(200, 500))
			}
		}
	}
	/**
	 * Gestion de l'état des actions du joueur
	 */
	public onPlayerMove(cell: DOMElement, xPos: number) {
		console.log(this.playerColor)
		if (this.isWaitingForPlayerMove) {
			this.isWaitingForPlayerMove = !this.makeMove(xPos, this.playerColor)
			if (this.isWaitingForPlayerMove) {
				return
			}
			if (this.gameStarted) {
				this.setPlayerTurn(false)
			}
			if (this.ws && this.multiplayerSessionId) {
				this.ws.send(JSON.stringify({ type: 'proxy', id: this.multiplayerSessionId, xPos }))
			}
		}
	}



	/**
	 * Action de placement de jeton dans le jeu
	 */
	public makeMove(xPos: number, color: 'red' | 'yellow'): boolean {
		console.log(color)
		let cellToFill: DOMElement | undefined
		let yPos = 0
		for (let i = 0; i < this.columns[xPos].length; i++) {
			const cell = this.columns[xPos][i];
			const color = cell.data('color')
			if (!color) {
				cellToFill = cell
				yPos = i
			}
			if (color) {
				break
			}

		}
		if (!cellToFill) {
			return false
		}
		cellToFill.data('color', color)
		this.checkWinner(xPos, yPos)
		return true
	}


	/**
	 * Gestion des conditions de victoire
	 *
	 */
	public checkWinner(x: number, y: number) {
		const win = this.checkDirection(x, y, 'horizontal') || this.checkDirection(x, y, 'vertical') || this.checkDirection(x, y, 'diagonal-left') || this.checkDirection(x, y, 'diagonal-right')
		const isFull = this.isFull()
		if (win === false) {
			if (isFull) {
				if (this.onWin) {
					this.onWin(undefined)
				}
				this.gameStarted = false
				console.log('Egalité')
				return
			}
			console.log('no winner currently')
			return false
		}

		this.gameStarted = false

		console.log(win)
		const clr = win[0].data('color') as 'red'
		if (this.onWin) {
			this.onWin(clr || undefined)
		}
		if (clr === this.getEnnemyColor()) {
			this.pointsJ2++
		} else {
			this.pointsJ1++
		}
		this.updatePoints()
		win.forEach((item) => {
			console.log(item.data('winner', 'true'))
		})
	}

	/**
	 * Gestion de colonne remplie
	 */
	public isFull() {
		for (const col of this.columns) {
			for (const cell of col) {
				const clr = cell.data('color')
				if (!clr) {
					return false
				}
			}
		}
		return true
	}

	/**
	 * Gestion du tableau de jeu lors de relance de partie
	 */
	public continueGame() {
		this.clearTable()
		if (this.ws && this.gameType === 'multi' && !this.gameStarted) {
			this.ws.send(JSON.stringify({ type: 'proxy', id: this.multiplayerSessionId, continue: true }))
		}
		this.gameStarted = true
		if (this.gameType === 'single' && !this.isWaitingForPlayerMove) {
			this.makeIATakeTurn()
		}
	}
	/**
	 * Attribution des points
	 */
	private updatePoints() {
		DOMElement.get('.j1p')?.text(this.pointsJ1 + '')
		DOMElement.get('.j2p')?.text(this.pointsJ2 + '')
	}

	/**
	 * Verification des conditions de victoires
	 */
	public checkDirection(x: number, y: number, direction: 'horizontal' | 'vertical' | 'diagonal-left' | 'diagonal-right'): Array<DOMElement> | false {
		console.log('Starting Check', direction)
		const color = this.columns[x][y].data('color')
		if (!color) {
			return false
		}
		const items = []
		let wentReverse: number | undefined
		for (let i = 0; i < 4; i++) {
			let newX = x
			if (direction === 'horizontal' || direction.startsWith('diagonal')) {
				newX = typeof wentReverse !== 'undefined' ? x + i - wentReverse : x - i
				if (direction === 'diagonal-left') {
					newX = typeof wentReverse !== 'undefined' ? x - i + wentReverse : x + i
				}
			}
			let newY = y
			if (direction === 'vertical' || direction.startsWith('diagonal')) {
				newY = typeof wentReverse !== 'undefined' ? y + i - wentReverse : y - i
			}



			if (!this.isYCorrect(newY) || !this.isXCorrect(newX)) {
				if (typeof wentReverse === 'undefined') {
					wentReverse = --i
					continue
				}
				return false
			}
			const element = this.columns[newX][newY]


			if (element.data('color') !== color) {
				if (typeof wentReverse === 'undefined') {
					wentReverse = --i
					continue
				}
				return false
			}
			items.push(element)
		}
		return items
	}
	/**
	 * Verification des placement de jetons verticaux
	 */
	private isXCorrect(x: number) {
		return x >= 0 && x < this.columns.length
	}

	/**
 * Verification des placement de jetons horizontaux
 */
	private isYCorrect(y: number) {
		return y >= 0 && y < this.columns[0].length
	}
	/**
	 * Gestion de l'IA
	 */

	public makeIATakeTurn() {
		let turnDone = false
		while (!turnDone) {
			const pos = getRandomInt(0, this.columns.length - 1)
			turnDone = this.makeMove(pos, 'red')
		}
		this.setPlayerTurn(true)
	}

}
/**
 * Création de number Aléatoire
 */
function getRandomInt(min: number, max: number) {
	return Math.floor(Math.random() * ((max + 1) - min)) + min
}




